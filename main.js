const path = require("path")
const url = require("url")

const { app, BrowserWindow, Tray, globalShortcut, ipcMain } = require("electron")

const WINDOW_WIDTH = 600
const WINDOW_HEIGHT = 400

let mainWindow, arrowWindow, trayIcon, positionTimer

const trayIconImage = path.join(__dirname, "static/images/tray-icon.png")
const trayIconImagePressed = path.join(__dirname, "static/images/tray-icon-selected.png")

function resetBounds() {
  const bounds = trayIcon.getBounds()
  mainWindow.setPosition((bounds.x + (bounds.width / 2)) - (WINDOW_WIDTH / 2), bounds.y + bounds.height + 16)
  arrowWindow.setPosition((bounds.x + (bounds.width / 2)) - 16, bounds.y + bounds.height)
}

function showWindow(focusSearch = true) {
  mainWindow.show()
  arrowWindow.show()
  trayIcon.setHighlightMode("always")
  trayIcon.setImage(trayIconImagePressed)
  if (focusSearch) mainWindow.webContents.send("focus-search")
  positionTimer = setInterval(resetBounds, 100)
}

function hideWindow() {
  mainWindow.hide()
  arrowWindow.hide()
  trayIcon.setHighlightMode("selection")
  trayIcon.setImage(trayIconImage)
  clearInterval(positionTimer)
}

function toggleWindow() {
  mainWindow.isVisible() ? hideWindow() : showWindow()
}

function createNote() {
  mainWindow.webContents.send("create-note")
}

app.on("ready", () => {

  if (process.platform === "darwin") app.dock.hide()

  mainWindow = new BrowserWindow({
    title: "Scratch",
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    resizable: false,
    frame: false,
    vibrancy: "light",
    transparent: true,
    show: false
  })

  arrowWindow = new BrowserWindow({
    parent: mainWindow,
    title: "",
    width: 32,
    height: 16,
    resizable: false,
    frame: false,
    transparent: true,
    show: false,
    hasShadow: false,
    focusable: false
  })

  arrowWindow.loadURL("http://localhost:3000/arrow.html")

  if (process.env.NODE_ENV === "production") {
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, "build/index.html"),
      protocol: "file:",
      slashes: true
    }))
  } else {
    mainWindow.loadURL("http://localhost:3000")
  }

  globalShortcut.register("CommandOrControl+Shift+\\", () => {
    resetBounds()
    toggleWindow()
  })

  globalShortcut.register("CommandOrControl+Alt+Shift+\\", () => {
    resetBounds()
    toggleWindow(false)
    createNote()
  })

  ipcMain.on("hide-window", hideWindow)

  mainWindow.on("close", () => mainWindow = null)

  // mainWindow.on("blur", () => hideWindow())

  trayIcon = new Tray(path.join(__dirname, "static/images/tray-icon.png"))

  trayIcon.setPressedImage(path.join(__dirname, "static/images/tray-icon-selected.png"))

  trayIcon.on("click", () => {
    resetBounds()
    toggleWindow()
  })
})
