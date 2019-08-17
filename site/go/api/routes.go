package api

import (
	"github.com/gin-gonic/gin"
)

func authenticatedHandler(manager auth.AuthenticationManager, handler func(c *gin.Context)) {
	return func(c* gin.Context) {
		parts := strings.SplitN(c.GetHeader("auth"), " ", 2)
		if len(parts) != 2 {
			c.JSON(http.StatusBadRequest, nil)
			return
		}
		am := manager.MatchToken(parts[0])
		if am == nil {
			c.JSON(http.StatusBadRequest, struct {
				message string
			}{
				message: "Cannot call authenticated ping method without valid authentication header",
			})
			return
		}
		id, err := (*am).ExtractIdentity(parts[1])
		if err != nil {
			c.JSON(http.StatusBadRequest, nil)
			return
		}
		handler(c)
	}
}

func RegisterRoutes(router *gin.Engine) {
	// TODO: api versioning
	router.GET("/api/circuits/:id", authenticatedHandler(CircuitLoadHandler))
	router.GET("/api/circuits", authenticatedHandler(CircuitQueryHandler))
	router.POST("/api/circuits", authenticatedHandler(CircuitCreateHandler))
	router.PUT("/api/circuits/:id", authenticatedHandler(CircuitStoreHandler))
}
