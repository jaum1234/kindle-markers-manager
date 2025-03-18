package test

import (
	"coura/klippify/internal/marker"
	"testing"
)

func TestExtractPositions(t *testing.T) {
	tests := []struct {
		name       string
		l          string
		start, end string
	}{
		{"Should extract the positions when the input is in potuguese.", "Seu destaque na página 66 | posição 1011-1013 | Adicionado: segunda-feira, 21 de outubro de 2024 17:32:25", "1011", "1013"},
		{"Should extract the positions when the input is in potuguese and the positinos have only one digit.", "Seu destaque na página 66 | posição 1-3 | Adicionado: segunda-feira, 21 de outubro de 2024 17:32:25", "1", "3"},
		{"Should extract the positions when the input it in english.", "You Highlight on page 20 | Location 2-4 | Added on Monday, October 21, 2024 5:32:25 PM", "2", "4"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			start, end := marker.ExtractPositions(tt.l)

			if start != tt.start || end != tt.end {
				t.Errorf("Expected %s-%s, got %s-%s", tt.start, tt.end, start, end)
			}
		})
	}
}

func TestExtractPage(t *testing.T) {
	tests := []struct {
		name     string
		l        string
		expected string
	}{
		{"Should extract the page when the input is in portuguese.", "Seu destaque na página 66 | posição 1011-1013 | Adicionado: segunda-feira, 21 de outubro de 2024 17:32:25", "66"},
		{"Should extract the page when the input is in english.", "You Highlight on page 20 | Location 2-4 | Added on Monday, October 21, 2024 5:32:25 PM", "20"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := marker.ExtractPage(tt.l)

			if result != tt.expected {
				t.Errorf("Expected %s, got %s", tt.expected, result)
			}
		})
	}
}

func TestExtractBookTitle(t *testing.T) {
	tests := []struct {
		name     string
		l        string
		expected string
	}{
		{"Should extract the book title when succeeded by parentheses.", "Computer Networking: A Top-Down Approach, 7/e (James Kurose;Keith Ross)", "Computer Networking: A Top-Down Approach, 7/e"},
		{"Should extract the book title when succeeded by dash.", "Computer Networking: A Top-Down Approach, 7/e - James Kurose;Keith Ross", "Computer Networking: A Top-Down Approach, 7/e"},
		{"Should extract the book title when there is no parentheses or dash.", "Computer Networking: A Top-Down Approach, 7/e", "Computer Networking: A Top-Down Approach, 7/e"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := marker.ExtractBookTitle(tt.l)

			if result != tt.expected {
				t.Errorf("Expected %s, got %s", tt.expected, result)
			}
		})
	}
}

func TestExtractAuthor(t *testing.T) {
	tests := []struct {
		name     string
		l        string
		expected string
	}{
		{"Should extract the author when between parentheses.", "Computer Networking: A Top-Down Approach, 7/e (James Kurose;Keith Ross)", "James Kurose;Keith Ross"},
		{"Should extract the author when preceded by dash.", "Computer Networking: A Top-Down Approach, 7/e - James Kurose;Keith Ross", "James Kurose;Keith Ross"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := marker.ExtractAuthor(tt.l)

			if result != tt.expected {
				t.Errorf("Expected %s, got %s", tt.expected, result)
			}
		})
	}
}

func TestCalculateTimestamp(t *testing.T) {
	tests := []struct {
		name     string
		l        string
		expected int64
	}{
		{
			"Should calculate the timestamp based on the date that the marking was done when the input is in portuguese.", 
			"Adicionado: segunda-feira, 21 de outubro de 2024 17:32:25", 
			1729531945,
		},
		{
			"Should calculate the timestamp based on the date that the marking was done when the input is in english.", 
			"Added on Monday, October 21, 2024 5:32:25 PM", 
			1729531945,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := marker.CalculateTimestamp(tt.l)

			if result != tt.expected {
				t.Errorf("Expected %d, got %d", tt.expected, result)
			}
		})
	}
}

func TestCreateMarker(t *testing.T) {
	tests := []struct {
		name     string
		l        []string
		expected marker.Marker
	}{
		{
			name: "Should create a marker when the input is in portuguese.",
			l:    []string{
				"Título do Livro (Autor)",
				"Seu destaque na página 66 | posição 1011-1013 | Adicionado: segunda-feira, 21 de outubro de 2024 17:32:25",
				"Conteúdo do destaque",
			},
			expected: marker.Marker{
				Type: "highlight",
				Page: "66",
				StartPositon: "1011",
				EndPosition: "1013",
				Content: "Conteúdo do destaque",
				Timestamp: 1729531945,
				Book: "Título do Livro",
				Author: "Autor",
			},
		},
		{
			name: "Should create a marker when the input is in english.",
			l:    []string{
				"Book Title (Author)",
				"You Highlight on page 20 | Location 2-4 | Added on Monday, October 21, 2024 5:32:25 PM",
				"Highlight Content",
			},
			expected: marker.Marker{
				Type: "highlight",
				Page: "20",
				StartPositon: "2",
				EndPosition: "4",
				Content: "Highlight Content",
				Timestamp: 1729531945,
				Book: "Book Title",
				Author: "Author",
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := marker.CreateMarker(tt.l);

			if result != tt.expected {
				t.Errorf("Expected %v, got %v", tt.expected, result)
			}
		})
	} 
}