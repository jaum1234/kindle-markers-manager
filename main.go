package main

import (
	"bufio"
	"log"
	"net/http"
	"regexp"
	"strings"

	"github.com/dlclark/regexp2"
	"github.com/gin-gonic/gin"
)

type Marker struct {
	Type         string `json:"id"`
	Page         string `json:"page"`
	StartPositon string `json:"startPosition"`
	EndPositon   string `json:"endPosition"`
	Content      string `json:"content"`
	Timestamp    int64  `json:"timestamp"`
	Book         string `json:"book"`
}

func readFile(c *gin.Context) {
	file, _, err := c.Request.FormFile("my-file")

	if err != nil {
		log.Fatal(err)
	}

	defer file.Close()

	scanner := bufio.NewScanner(file)

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

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}

	var markers []Marker

	for _, marker := range buffer {
		var m Marker

		for i, line := range marker {
			switch i {
			case 0:
				m.Book = line
			case 1:
				isHighlight := regexp.MustCompile(`destaque`)
				res := isHighlight.MatchString(line)

				if res {
					m.Type = "highlight"
				} else {
					m.Type = "note"
				}

				page := regexp2.MustCompile(`(?<=página )\d+(-\d+)?(?= \|)`, 0)

				matches, _ := page.FindStringMatch(line)

				if matches == nil {
					log.Fatal("Missing page: " + line)
				}

				m.Page = matches.String()

				position := regexp2.MustCompile(`(?<=posição )\d+(-\d+)?(?= \|)`, 0)

				matches, _ = position.FindStringMatch(line)

				if matches == nil {
					m.StartPositon = "0"
					m.EndPositon = "0"
				} else {
					split := strings.Split(matches.String(), "-")

					m.StartPositon = split[0]

					if len(split) > 1 {
						m.EndPositon = split[1]
					} else {
						m.EndPositon = split[0]
					}
				}

			case 2:
				m.Content = line
			}
		}

		markers = append(markers, m)
	}

	c.IndentedJSON(http.StatusOK, markers)
}

func renderMainPage(c *gin.Context) {
	c.HTML(http.StatusOK, "index.html", gin.H{})
}

func main() {
	r := gin.Default()

	r.LoadHTMLGlob("views/*")

	r.Static("/assets", "assets/")

	r.POST("/read-file", readFile)
	r.GET("/", renderMainPage)

	r.Run("localhost:8001")
}
