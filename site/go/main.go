package main

import (
	"github.com/OpenCircuits/OpenCircuits/site/go/api"
	"github.com/OpenCircuits/OpenCircuits/site/go/core"
	"github.com/OpenCircuits/OpenCircuits/site/go/core/auth"
	"github.com/OpenCircuits/OpenCircuits/site/go/core/model/storage"
	"github.com/OpenCircuits/OpenCircuits/site/go/web"
	"github.com/gin-gonic/contrib/sessions"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	// TODO: use switches for which storage factory to instantiate
	f := storage.MemCircuitStorageInterfaceFactory{}
	core.SetCircuitStorageInterfaceFactory(&f)

	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	// Generate CSRF Token... uhh, is this the same for every user?
	store := sessions.NewCookieStore([]byte(auth.RandToken(64)))
	store.Options(sessions.Options{
		Path:   "/",
		MaxAge: 60 * 60 * 24 * 7,
	})
	router.Use(sessions.Sessions("opencircuitssession", store))

	web.RegisterPages(router)
	api.RegisterRoutes(router)

	router.Run("127.0.0.1:9090")
}

// TODO: BLocking: make sure sqlite works; get the 'My Circuits' to show up
// TODO: Set up command-line switch handling code
