for (const [index, p] of document.querySelectorAll("p").entries()) {
    if (p.textContent.search(/!\[\[(.+)excalidraw(.+)\]\]/) !== -1) {
        const excalidrawFileWithFormat = p.textContent.match(/!\[\[(.+)\]\]/)[1]
        const excalidrawFileName = excalidrawFileWithFormat.toString().split('|')[0]
        const excalidrawFileNameMD = `${excalidrawFileName.trimEnd().trimStart()}.md`;

        var newExcalidrawBlock = document.createElement("div");

        //
        // <div
        //     onWheelCapture={e => {
        //         // Stop Excalidraw from hijacking scroll
        //         e.stopPropagation();
        //     }}
        // >
        newExcalidrawBlock.setAttribute("id", `excalidraw-${index}`);
        newExcalidrawBlock.innerHTML = "";
        p.parentNode.replaceChild(newExcalidrawBlock, p);

        let url = `https://raw.githubusercontent.com/0xzphil/blog/main/academy/Excalidraw/${excalidrawFileNameMD}`;
        fetch(url)
            .then(res => {
                res.text().then(r => {
                    var code = r.toString().match(/```json(.*)```/s)[1];
                    var elements = JSON.parse(code).elements;
                    console.log(elements)


                    const [excalidrawAPI, setExcalidrawAPI] = React.useState(null);
                    React.useEffect(() => {
                        if (!excalidrawAPI) {
                            return;
                        }
                        const elm = excalidrawAPI.getSceneElements();
                        excalidrawAPI.scrollToContent(elm, {
                            fitToContent: true,
                            animate: true
                        })
                    }, [excalidrawAPI]);
                    const App = () => {
                        var options =  {
                            initialData: {
                                elements
                            },
                            viewModeEnabled: true,
                            excalidrawAPI: (api)=> setExcalidrawAPI(api)
                        };

                        return React.createElement(
                            React.Fragment,
                            null,
                            React.createElement(
                                "div",
                                {
                                    style: { height: "500px" },
                                },
                                React.createElement(ExcalidrawLib.Excalidraw, options),
                            ),
                        );
                    };

                    const excalidrawWrapper = document.getElementById(`excalidraw-${index}`);
                    const root = ReactDOM.createRoot(excalidrawWrapper);
                    root.render(React.createElement(App));
                })
            })
            .then(out =>
                console.log('Checkout this JSON! ', out))
            .catch(err => { throw err });

    }
}
