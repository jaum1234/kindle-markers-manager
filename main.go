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
func RemoveEmptyMarks(buffer [][]string, ch chan [][]string) {
	var temp [][]string

	for _, mark := range buffer {
		for i, line := range mark {
			if i == ContentLine && !regexp.MustCompile(`^\s*$`).MatchString(line) {
				temp = append(temp, mark)
			}
		}
	}

	ch <- temp
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

func CreateMarker(data []string) Marker {
	var m Marker

	for line, data := range data {
		switch line {
		case BookLine:
			m.Author = ExtractAuthor(data)
			m.Book = ExtractBookTitle(data)
		case MetadataLine:
			isHighlight := regexp2.MustCompile(`destaque|highlight`, 1)
			match, _ := isHighlight.FindStringMatch(data)

			if match != nil {
				m.Type = "highlight"
			} else {
				m.Type = "note"
			}

			m.Page = ExtractPage(data)
			m.StartPositon, m.EndPosition = ExtractPositions(data)

		case ContentLine:
			m.Content = data
		}
	}

	return m
}

func CreateMarkers(buffer [][]string, ch chan []Marker) {
	var markers []Marker

	for _, data := range buffer {
		markers = append(markers, CreateMarker(data))
	}

	ch <- markers
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

	ch1 := make(chan [][]string)

	go RemoveEmptyMarks(buffer[:len(buffer)/2], ch1)
	go RemoveEmptyMarks(buffer[len(buffer)/2:], ch1)

	x, y := <-ch1, <-ch1

	newBuffer := append(x, y...)

	ch2 := make(chan []Marker)

	go CreateMarkers(newBuffer[:len(newBuffer)/2], ch2)
	go CreateMarkers(newBuffer[len(newBuffer)/2:], ch2)

	z, w := <-ch2, <-ch2

	c.IndentedJSON(http.StatusOK, gin.H{
		"data": append(z, w...),
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
