import {useEffect, useState, useCallback, useContext} from "react";
import axios from "axios";
import {Button, Element, Form, Card, Modal} from "react-bulma-components";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAngleLeft, faArrowCircleLeft, faEdit, faTrashAlt} from '@fortawesome/free-solid-svg-icons'

import {AppContext} from "../app";

function Maker({item}) {
    const appContext = useContext(AppContext);
    const [img, setImg] = useState("");
    const [quote, setQuote] = useState(item.quote);
    const [showDelete, setShowDelete] = useState(false);
    const [doDelete, setDoDelete] = useState(false);
    const [deleteMe, setDeleteMe] = useState();

    useEffect(() => {
        const form = new FormData();
        form.append("id", item.id);
        form.append("quote", quote);

        const img_api = appContext.api_url + "img";
        const config = {
            responseType: 'blob'
        };
        axios.post(img_api, form, config)
            .then(res => {
                URL.revokeObjectURL(img);
                let url = URL.createObjectURL(res.data);
                setImg(url);
            })
            .catch(api_error);
    }, [item, quote]);

    useEffect( ()=>{
        setDoDelete(deleteMe === "delete me")
    }, [deleteMe]);

    const api_error = useCallback(err => {
        const status = err.response.status;
        if (status === 413) {
            alert("The size of the image file that can be handled is up to 1024KByte.");
        } else {
            alert(err.response.statusText);
        }
    }, []);

    const toggleDelete = () => {
        setShowDelete(!showDelete);
    };

    const handleDelete = () => {
        item.delete = true;
        const img_api = appContext.api_url + "delete";
        axios.post(img_api, {id: item.id})
            .then(res => {
                appContext.itemSelect.deselect();
                appContext.loadAs.set();
                setShowDelete(false);
            })
            .catch(api_error);
    };

    return (
        <>
            <Card mx={2} display="inline-block">
                <Card.Header>
                    <Card.Header.Title>
                        <Element renderAs="a" onClick={appContext.itemSelect.deselect}>
                            <FontAwesomeIcon icon={faArrowCircleLeft} size="2x" color="#444"/>
                        </Element>
                        <Element textSize={5} ml={3} mb={1}>{item.signature}</Element>
                    </Card.Header.Title>
                </Card.Header>
                <Card.Content display="inline-flex" flexWrap="wrap">
                    <img src={img} alt="image" />
                    <Element ml={4}>
                        <Form.Field>
                            <Form.Label mb={1}>{item.name}のセリフを入力</Form.Label>
                            <Form.Label textSize={7}>(吹き出しに収まるよう適宜改行)</Form.Label>
                            <Form.Field.Body>
                                <Form.Textarea value={quote} onChange={e => {
                                    setQuote(e.target.value)
                                }} cols={7} rows={4} placeholder="例) このあらいを作ったのは"/>
                            </Form.Field.Body>
                        </Form.Field>
                        <Button.Group align="right">
                            <Button renderAs="a" href={img} download="who.png" rounded={true}
                                    color="link">Download</Button>
                        </Button.Group>
                    </Element>
                </Card.Content>
                <Card.Footer>
                    <Card.Footer.Item justifyContent="flex-end">
                        <Element renderAs="a" onClick={toggleDelete}>
                            <FontAwesomeIcon icon={faTrashAlt} size="lg" color="#444"/>
                        </Element>
                        <Element renderAs="a" ml={4} onClick={appContext.editor.open}>
                            <FontAwesomeIcon icon={faEdit} size="lg" color="#444"/>
                        </Element>
                    </Card.Footer.Item>
                </Card.Footer>
            </Card>
            <Modal show={showDelete} onClose={toggleDelete}>
                <Modal.Card>
                    <Modal.Card.Header>
                        <Modal.Card.Title textSize={6}>削除</Modal.Card.Title>
                    </Modal.Card.Header>
                    <Modal.Card.Body>
                        <Element>本当に削除しますか?<br/>削除する場合は、以下のフォームに delete me と入力して削除ボタンを押してください。</Element>
                        <Form.Input value={deleteMe}
                                    onChange={(e)=>{setDeleteMe(e.target.value)}}/>
                    </Modal.Card.Body>
                    <Modal.Card.Footer renderAs={Button.Group} align="right">
                        <Button rounded={true} onClick={toggleDelete}>キャンセル</Button>
                        <Button color="warning" rounded={true} onClick={handleDelete} disabled={!doDelete}>削除</Button>
                    </Modal.Card.Footer>
                </Modal.Card>
            </Modal>
        </>
    );
}

export default Maker;
