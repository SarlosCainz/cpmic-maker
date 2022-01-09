import React, {useCallback, useEffect, useState} from "react";
import "bulma/css/bulma.min.css";

import axios from "axios";
import Header from "./components/Header";
import Body from "./components/Body";

export const AppContext = React.createContext();

function App() {
    const api_url = import.meta.env.VITE_API_URL;

    const [loadAs, setLoadAs] = useState(0);
    const [itemList, setItemList] = useState([]);
    const [itemSelect, setItemSelect] = useState(-1);
    const [showEditor, setShowEditor] = useState(false);

    const appContext = {
        api_url: api_url,
        itemList: itemList,
        getItem: useCallback( () => {
            if (itemSelect < 0) {
                return {
                    id: "",
                    name: "",
                    quote: "",
                    signature: "",
                    position: "behind",
                    quote_x: 0,
                    quote_y: 0,
                    font_size: 12,
                    img: ""
                };
            } else {
                const item = itemList[itemSelect]
                console.log(item)
                return item;
            }
        }, [itemList, itemSelect]),
        loadAs: {
            value: loadAs,
            set: () => {
                const now = new Date()
                setLoadAs(now.getTime())
            }
        },
        itemSelect: {
            value: itemSelect,
            set: setItemSelect,
            deselect: () => {setItemSelect(-1)}
        },
        editor: {
            state: showEditor,
            set: setShowEditor,
            toggle: () => {setShowEditor(!showEditor)},
            open: () => {setShowEditor(true)},
            close: () => {setShowEditor(false)}
        }
    };

    useEffect( () => {
        axios.get(api_url + "items")
            .then(res => {
                setItemList(res.data);
            })
            .catch(err => {
                alert(err);
            });
    }, [loadAs])

    return (
        <AppContext.Provider value={appContext}>
            <Header/>
            <Body/>
        </AppContext.Provider>
    );
}

export default App;
