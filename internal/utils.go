package internal

import (
	"bufio"
	"fmt"
	"log"
	"regexp"
	"strings"
	"time"

	"github.com/dlclark/regexp2"
)

const UNKNOWN string = "unknown"

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
	return MatchOrUnknown(line, `(?<=página|page) \d+(-\d+)?`)
}

func ExtractPositions(line string) (string, string) {
	position := regexp2.MustCompile(`(?<=posição|location) \d+(-\d+)?`, 1)

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
