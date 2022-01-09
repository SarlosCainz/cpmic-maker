import {useContext, useCallback, useEffect, useState} from "react";
import {AppContext} from "../app";
import {Block, Card, Element} from "react-bulma-components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusSquare, faSquare} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function Preview() {
    const appContext = useContext(AppContext);

    return (
        <Block display="flex" flexWrap="wrap">
            {appContext.itemList.map((item, index) => {
                if (!item.delete) {
                    return (
                        <PreviewCard key={index} index={index} item={item}/>
                    )
                }
            })}
            <Element flexGrow={2} textAlign="right" m={2}>
                <Element renderAs="a" onClick={appContext.editor.open}>
                    <FontAwesomeIcon icon={faPlusSquare} size="2x" color="#777"/>
                </Element>
            </Element>
        </Block>
    );
}

function PreviewCard({index, item}) {
    const appContext = useContext(AppContext);
    const [img, setImg] = useState("");

    useEffect( () => {
        const form = new FormData();
        form.append("id", item.id);

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
                if (err.response.status !== 404) {
                    alert(err);
                }
            });
    }, [item]);

    const handleClick = useCallback(() => {
        appContext.itemSelect.set(index);
    }, [index]);

    return (
        <Element renderAs="a" onClick={handleClick}>
            <Card mx={2}>
                <Card.Header>
                    <Card.Header.Title>
                        <FontAwesomeIcon icon={faSquare}/>
                        <Element ml={1} renderAs="span">{item.signature}</Element>
                    </Card.Header.Title>
                </Card.Header>
                <Card.Image src={img} alt="img" style={{width: "256px"}}/>
            </Card>
        </Element>
    );
}

export default Preview;
