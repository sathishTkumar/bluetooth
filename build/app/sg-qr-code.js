/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

class Events {
    render() {
        return (h("ion-page", null,
            h("ion-header", null,
                h("ion-navbar", { hideBackButton: true },
                    h("ion-title", null, "QR-code "))),
            h("ion-content", null,
                h("div", { class: "app" },
                    h("div", { class: "toolbar" },
                        h("div", { id: "device-name", class: "name" }, "Terminal"),
                        h("div", { class: "buttons" },
                            h("button", { id: "connect", type: "button", "aria-label": "Connect" },
                                h("i", { class: "material-icons" }, "bluetooth_connected")),
                            h("button", { id: "disconnect", type: "button", "aria-label": "Disconnect" },
                                h("i", { class: "material-icons" }, "bluetooth_disabled")))),
                    h("div", { id: "terminal", class: "terminal" }),
                    h("form", { id: "send-form", class: "send-form" },
                        h("input", { id: "input", type: "text", "aria-label": "Input", autocomplete: "off", placeholder: "Type something to send..." }),
                        h("button", { type: "submit", "aria-label": "Send" },
                            h("i", { class: "material-icons" }, "send")))),
                h("script", { src: "../../assets/js/BluetoothTerminal.js" }),
                h("script", { src: "../../assets/js/main.js" }),
                h("script", { src: "../../assets/js/companion.js" }))));
    }
    static get is() { return "sg-qr-code"; }
    static get style() { return ""; }
}

export { Events as SgQrCode };
