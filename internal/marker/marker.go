package marker

import (
	"bufio"
	"coura/klippify/internal/utils"
	"fmt"
	"log"
	"regexp"
	"strings"
	"time"

	"github.com/dlclark/regexp2"
)

const (
	BookLine = iota
	MetadataLine
	ContentLine
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

type ByTimestamp []Marker

func (m ByTimestamp) Len() int {
	return len(m)
}

func (m ByTimestamp) Less(i, j int) bool {
	return m[i].Timestamp < m[j].Timestamp
}

func (m ByTimestamp) Swap(i, j int) {
	m[i], m[j] = m[j], m[i]
}

func CreateMarkers(buffer [][]string, ch chan []Marker) {
	var markers []Marker

	for _, data := range buffer {
		markers = append(markers, CreateMarker(data))
	}

	ch <- markers
}

func CreateMarker(data []string) Marker {
	var m Marker

	for line, d := range data {
		switch line {
		case BookLine:
			m.Author = ExtractAuthor(d)
			m.Book = ExtractBookTitle(d)
		case MetadataLine:
			parts := strings.Split(d, "|")

			isHighlight := regexp2.MustCompile(`destaque|highlight`, 1)
			match, _ := isHighlight.FindStringMatch(parts[0])

			if match != nil {
				m.Type = "highlight"
			} else {
				m.Type = "note"
			}

			m.Page = ExtractPage(parts[0])
			m.StartPositon, m.EndPosition = ExtractPositions(parts[1])

			if len(parts) == 2 {
				m.Timestamp = CalculateTimestamp(parts[1])
			} else {
				m.Timestamp = CalculateTimestamp(parts[2])
			}

		case ContentLine:
			m.Content = d
		}
	}

	return m
}

var months = map[string]string{
	"janeiro":   "01",
	"fevereiro": "02",
	"março":     "03",
	"abril":     "04",
	"maio":      "05",
	"junho":     "06",
	"julho":     "07",
	"agosto":    "08",
	"setembro":  "09",
	"outubro":   "10",
	"novembro":  "11",
	"dezembro":  "12",
}

func ExtractAuthor(line string) string {
	return utils.MatchOrUnknown(line, `(?<=\().+(?=\))`)
}

func ExtractBookTitle(line string) string {
	return utils.MatchOrUnknown(line, `.+(?= \()`)
}

func ExtractPage(line string) string {
	return utils.MatchOrUnknown(line, `(?<=página |page )\d+(-\d+)?`)
}

func ExtractPositions(line string) (string, string) {
	position := regexp2.MustCompile(`(?<=posição|location) \d+(-\d+)?`, 1)

	matches, _ := position.FindStringMatch(line)

	if matches == nil {
		return utils.UNKNOWN, utils.UNKNOWN
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

func CalculateTimestamp(str string) int64 {
	dateParts := strings.Split(str, ",")

	date := strings.Split(strings.Trim(dateParts[1], " "), " de ")

	date[0] = fmt.Sprintf("%0*s", 2, date[0])

	date[1] = months[date[1]]
	date[1] = fmt.Sprintf("%0*s", 2, date[1])

	parsedTime, err := time.Parse("02 01 2006 15:04:05", strings.Join(date, " "))

	if err != nil {
		log.Fatal(err)
	}

	return parsedTime.Unix()
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
