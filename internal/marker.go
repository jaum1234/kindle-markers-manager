package internal

import (
	"strings"

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
