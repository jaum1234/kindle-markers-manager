package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"regexp"
	"strings"

	"github.com/dlclark/regexp2"
)

type Marker struct {
	Type         string
	Page         string
	StartPositon string
	EndPositon   string
	Content      string
	Timestamp    int64
	Book         string
}

func main() {
	file, err := os.Open("My Clippings copy.txt")

	if err != nil {
		log.Fatal(err)
	}

	defer file.Close()

	scanner := bufio.NewScanner(file)

	var buffer [][]string
	var temp []string

	for scanner.Scan() {
		text := strings.Trim(scanner.Text(), " ")
		// fmt.Println(text)
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
	// fmt.Println(buffer)
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

				page := regexp2.MustCompile(`(?<=página )\d+(?= \|)`, 0)

				matches, _ := page.FindStringMatch(line)

				if matches == nil {
					log.Fatal("Missing page.")
				}

				m.Page = matches.String()

				position := regexp2.MustCompile(`(?<=posição )\d+-\d+(?= \|)`, 0)

				matches, _ = position.FindStringMatch(line)

				if matches == nil {
					log.Fatal("Missing position.")
				}

				split := strings.Split(matches.String(), "-")

				m.StartPositon = split[0]
				m.EndPositon = split[1]
			case 2:
				m.Content = line
			}
		}

		markers = append(markers, m)
	}

	fmt.Println(markers)
}
