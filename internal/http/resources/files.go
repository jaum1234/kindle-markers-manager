package resources

import (
	"bufio"
	"coura/kindlemanager/internal"
	"net/http"
	"sort"

	"github.com/gin-gonic/gin"
)

func RenderMainPage(c *gin.Context) {
	c.HTML(http.StatusOK, "index.html", gin.H{})
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
	buffer := internal.GroupLinesPerMark(scanner)

	if err := scanner.Err(); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	ch1 := make(chan [][]string)

	go internal.RemoveEmptyMarks(buffer[:len(buffer)/2], ch1)
	go internal.RemoveEmptyMarks(buffer[len(buffer)/2:], ch1)

	x, y := <-ch1, <-ch1

	newBuffer := append(x, y...)

	ch2 := make(chan []internal.Marker)

	go internal.CreateMarkers(newBuffer[:len(newBuffer)/2], ch2)
	go internal.CreateMarkers(newBuffer[len(newBuffer)/2:], ch2)

	z, w := <-ch2, <-ch2

	markers := append(z, w...)

	sort.Sort(internal.ByTimestamp(markers))

	c.IndentedJSON(http.StatusOK, gin.H{
		"data": markers,
	})
}
