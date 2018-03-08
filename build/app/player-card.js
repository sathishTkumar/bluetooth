/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

class PlayerCard {
    render() {
        return (h("div", { class: "walletimg_bg" },
            h("ion-grid", { class: "membership animated bounceIn grid" },
                h("ion-row", { class: "row" },
                    h("ion-col", { class: "name-on-card col" }, "Guest")),
                h("ion-row", { class: "card-number row" },
                    h("ion-col", { class: "col" },
                        h("strong", { class: "pull-right" }))),
                h("ion-row", { class: "row" },
                    h("ion-col", { class: "text-uppercase card-copyrights col", "text-right": "" }, "\u00A9 2017, Casino6601 International, Inc.")))));
    }
    static get is() { return "player-card"; }
    static get style() { return ".walletimg_bg {\n  position: relative;\n  padding: 15px;\n  background: url(../assets/dark/carded-bg.jpg) no-repeat;  \n  background-size: cover;\n}\n\n.membership {\n  background: url(../assets/dark/hardrock-membership.png) no-repeat center;\n  height: 140px;\n  background-size: contain;\n  margin: auto;\n  width: 280px;\n  color: #fff;\n  padding: 0;\n}"; }
}

export { PlayerCard };
