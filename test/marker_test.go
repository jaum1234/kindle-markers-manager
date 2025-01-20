package test

import (
	"coura/kindlemanager/internal/marker"
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
		{"Should extract the book title.", "Computer Networking: A Top-Down Approach, 7/e (James Kurose;Keith Ross)", "Computer Networking: A Top-Down Approach, 7/e"},
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

func TestCalculateTimestamp(t *testing.T) {
	tests := []struct {
		name     string
		l        string
		expected int64
	}{
		{"Should calculate the timestamp based on the date that the marking was done.", "Seu destaque na página 66 | posição 1011-1013 | Adicionado: segunda-feira, 21 de outubro de 2024 17:32:25", 1729531945},
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
