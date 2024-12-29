package main

import (
	"bufio"
	"net/http"
	"regexp"
	"strings"

	"github.com/dlclark/regexp2"
	"github.com/gin-gonic/gin"
)

type Marker struct {
	Type         string `json:"type"`
	Page         string `json:"page"`
	StartPositon string `json:"startPosition"`
	EndPosition  string `json:"endPosition"`
	Content      string `json:"content"`
	Timestamp    int64  `json:"timestamp"`
	Book         string `json:"book"`
	Author       string `json:"author"`
}

const UNKNOWN string = "unknown"
const (
	BookLine = iota
	MetadataLine
	ContentLine
)

func MatchOrUnknown(text string, pattern string) string {
	res := regexp2.MustCompile(pattern, 1)
	matches, _ := res.FindStringMatch(text)

	if matches != nil {
		return matches.String()
	}

	return UNKNOWN
}

func ExtractAuthor(line string) string {
	return MatchOrUnknown(line, `(?<=\().+(?=\))`)
}

func ExtractBookTitle(line string) string {
	return MatchOrUnknown(line, `.+(?= \()`)
}

func ExtractPage(line string) string {
	return MatchOrUnknown(line, `(?<=página|page) \d+(-\d+)?(?= \|)`)
}

func ExtractPositions(line string) (string, string) {
	position := regexp2.MustCompile(`(?<=posição|location) \d+(-\d+)?(?= \|)`, 1)

	matches, _ := position.FindStringMatch(line)

	if matches == nil {
		return UNKNOWN, UNKNOWN
	}

	split := strings.Split(matches.String(), "-")

	start := strings.Trim(split[0], " ")
	var end string

	if len(split) > 1 {
		end = strings.Trim(split[1], " ")
	} else {
		end = strings.Trim(split[0], " ")
	}

	return start, end
}

func CreateMarker(data []string) Marker {
	var m Marker

	for i, line := range data {
		switch i {
		case BookLine:
			m.Author = ExtractAuthor(line)
			m.Book = ExtractBookTitle(line)
		case MetadataLine:
			isHighlight := regexp2.MustCompile(`destaque|highlight`, 1)
			match, _ := isHighlight.FindStringMatch(line)

			if match != nil {
				m.Type = "highlight"
			} else {
				m.Type = "note"
			}

			m.Page = ExtractPage(line)
			m.StartPositon, m.EndPosition = ExtractPositions(line)

		case ContentLine:
			m.Content = line
		}
	}

	return m
}

func RemoveEmptyMarks(buffer [][]string) [][]string {
	var temp [][]string

	for _, mark := range buffer {
		for i, line := range mark {
			if i == ContentLine && !regexp.MustCompile(`^\s*$`).MatchString(line) {
				temp = append(temp, mark)
			}
		}
	}

	return temp
}

func GroupLinesPerMark(scanner *bufio.Scanner) [][]string {
	var buffer [][]string
	var temp []string

	for scanner.Scan() {
		text := strings.Trim(scanner.Text(), " ")
		markerSeparator := regexp.MustCompile(`^=+$`)
		whiteSpaces := regexp.MustCompile(`^\s*$`)

		if !markerSeparator.MatchString(text) {
			if !whiteSpaces.MatchString(text) {
				temp = append(temp, text)
			}
		} else {
			buffer = append(buffer, temp)
			temp = make([]string, 0)
		}
	}

	return buffer
}

func ReadFile(c *gin.Context) {
	file, _, err := c.Request.FormFile("my-file")

	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	defer file.Close()

	scanner := bufio.NewScanner(file)
	buffer := GroupLinesPerMark(scanner)

	if err := scanner.Err(); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	newBuffer := RemoveEmptyMarks(buffer)

	var markers []Marker

	for _, data := range newBuffer {
		markers = append(markers, CreateMarker(data))
	}

	c.IndentedJSON(http.StatusOK, gin.H{
		"data": markers,
	})
}

func RenderMainPage(c *gin.Context) {
	c.HTML(http.StatusOK, "index.html", gin.H{})
}

func main() {
	r := gin.Default()

	r.LoadHTMLGlob("views/*")

	r.Static("/assets", "assets/")

	r.POST("/read-file", ReadFile)
	r.GET("/", RenderMainPage)

	r.Run("localhost:8001")
}
