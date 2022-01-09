import {useContext} from "react";
import {AppContext} from "../app";
import Preview from "./Preview";
import Maker from "./Maker";
import Editor from "./Editor";

function Body() {
    const appContext = useContext(AppContext);

    return (
        <>
            {appContext.itemSelect.value < 0 ? <Preview/> : <Maker item={appContext.getItem()} />}
            {appContext.editor.state ? <Editor item={appContext.getItem()} /> : <></>}
        </>
    );
}

export default Body;
