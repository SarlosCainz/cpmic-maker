import {Modal, Form, Element, Button} from "react-bulma-components";
import {useContext, useState, useEffect, useCallback} from "react";
import {AppContext} from "../app";
import axios from "axios";


function Editor({item}) {
    const appContext = useContext(AppContext);
    const [name, setName] = useState(item.name);
    const [quote, setQuote] = useState(item.quote);
    const [quoteX, setQuoteX] = useState(item.quote_x);
    const [quoteY, setQuoteY] = useState(item.quote_y);
    const [signature, setSignature] = useState(item.signature);
    const [position, setPosition] = useState(item.position);
    const [fontSize, setFontSize] = useState(item.font_size);
    const [img, setImg] = useState("");
    const [filename, setFilename] = useState("");
    const [uploadFile, setUploadFile] = useState(null);
    const [formData, setFormData] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect( () => {
        if (fontSize.length === 0 || (item.id === "" && uploadFile === null)) {
            return;
        }
        const form = new FormData();
        form.append("id", item.id);
        form.append("signature", signature);
        form.append("quote", quote);
        form.append("position", position);
        form.append("font_size", fontSize);
        form.append("quote_x", quoteX);
        form.append("quote_y", quoteY);
        if (uploadFile) {
            form.append("image", uploadFile);
        }
        setFormData(form);

        const img_api = appContext.api_url + "img";
        const config = {
            responseType: 'blob'
        };
        axios.post(img_api, form, config)
            .then(res => {
                URL.revokeObjectURL(img);
                const url = URL.createObjectURL(res.data);
                setImg(url);
            })
            .catch(err => {
                alert(err);
            });
    }, [quote, quoteX, quoteY, signature, position, fontSize, uploadFile]);

    useEffect( ()=>{
        setReady(name && quote && signature  && uploadFile);
    }, [name, quote, signature, uploadFile]);

    const handleChangeImage = useCallback( (e) => {
        const file = e.target.files[0];
        setUploadFile(file);
        setFilename(file.name);

    }, []);

    const handleSave = useCallback(() => {
        const form = formData
        form.append("name", name);

        const img_api = appContext.api_url + "save";
        axios.post(img_api, form)
            .then(res => {
                appContext.loadAs.set();
                appContext.editor.close();
            })
            .catch(err => {
                alert(err);
            });
    }, [formData, name]);

    return (
        <Modal show={appContext.editor.state} onClose={appContext.editor.close} showClose={false}>
            <Modal.Card>
                <Modal.Card.Header>
                    <Modal.Card.Title textSize={6}>
                        {item.id == 0 ? "新規" : "編集"}
                    </Modal.Card.Title>
                </Modal.Card.Header>
                <Modal.Card.Body display="inline-flex" flexWrap={"wrap"}>
                    <Element mr={4}>
                        <img id="img" src={img} alt="画像を指定してください。" style={{width: "260px"}}/>
                        <Form.InputFile mb={4} onChange={handleChangeImage} filename={filename}
                                        inputProps={{accept: "image/jpeg, image/png"}}/>
                    </Element>
                    <Element flexGrow={2}>
                        <Form.Field>
                            <Form.Label>キャラクター名</Form.Label>
                            <Form.Input value={name} onChange={(e) => {
                                setName(e.target.value)
                            }}/>
                        </Form.Field>
                        <Form.Field>
                            <Form.Label>決め台詞</Form.Label>
                            <Form.Input value={signature} onChange={(e) => {
                                setSignature(e.target.value)
                            }}/>
                        </Form.Field>
                        <Form.Field>
                            <Form.Label>台詞（デフォルト）</Form.Label>
                            <Form.Textarea value={quote} onChange={(e) => {
                                setQuote(e.target.value)
                            }} rows={3}/>
                        </Form.Field>
                        <Form.Field>
                            <Form.Label>決め台詞の位置</Form.Label>
                            <Form.Radio name="position" value="front"
                                        onChange={(e)=>{setPosition(e.target.value)}}
                                        checked={position === "front"}>台詞の前</Form.Radio>
                            <Form.Radio name="position" value="behind"
                                        onChange={(e)=>{setPosition(e.target.value)}}
                                        checked={position === "behind"}>台詞の後</Form.Radio>
                        </Form.Field>
                        <Form.Field>
                            <Form.Label>フォントサイズ</Form.Label>
                            <Form.Input value={fontSize} style={{width: "3em"}}
                                        onChange={(e)=>{setFontSize(e.target.value)}}/>
                        </Form.Field>
                        <Form.Field>
                            <Form.Label>セリフ位置(X)</Form.Label>
                            <input type="range" value={quoteX} min={0} max={350-fontSize}
                                   onChange={(e) => setQuoteX(e.target.value)}/>
                        </Form.Field>
                        <Form.Field>
                            <Form.Label>セリフ位置(Y)</Form.Label>
                                <input type="range" value={quoteY} min={0} max={350}
                                       onChange={(e) => setQuoteY(e.target.value)}/>
                        </Form.Field>
                        <Button.Group align="right">
                            <Button rounded={true} onClick={appContext.editor.close}>キャンセル</Button>
                            <Button color="link" rounded={true} disabled={!ready}
                                    onClick={handleSave}>保存</Button>
                        </Button.Group>
                    </Element>
                </Modal.Card.Body>
            </Modal.Card>
        </Modal>
    );
}

export default Editor;
