import React, { useState, useEffect } from 'react';
import {
    CheckCircleOutlined,
    PlayCircleOutlined
} from '@ant-design/icons';
import { Input, Flex } from 'antd';
import { Button } from 'antd';
import { Col, Row } from 'antd';
import Editor from '@monaco-editor/react';
import axios from 'axios';

const Args = ({ urlpath, template }) => {

    const [objpath, setObjPath] = useState("")
    const [inputs, setInputs] = useState("{}")
    const [outputs, setOutputs] = useState("{}")

    useEffect(() => {

        if (urlpath && template) {
            setObjPath(urlpath)
            setInputs(template)
        }

    }, [urlpath, template]);

    function isJSON(str) {
        try {
            JSON.stringify(JSON.parse(str));
            return true;
        } catch (e) {
            return false;
        }
    }

    const updateInputs = (e) => {
        if (isJSON(e) === true) {
            setInputs(e)
        }
    };

    const runValidate = () => {
        if (objpath && inputs) {
            axios.post('http://localhost:8000/conf/' + objpath, inputs, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    setOutputs(JSON.stringify([response.data], null, 2))
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    const runExecute = () => {
        if (objpath && inputs) {
            axios.post('http://localhost:8000/exec/' + objpath, inputs, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    setOutputs(JSON.stringify([response.data], null, 2))
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    return (
        <div>

            <Flex gap='middle' style={{
                marginBottom: 10
            }}>
                <Input style={{
                    color: 'black',
                    backgroundColor: 'white'
                }} value={objpath} disabled />
                <Button type="primary" shape="circle" icon={<CheckCircleOutlined />} onClick={runValidate} size='large' />
                <Button type="primary" shape="circle" icon={<PlayCircleOutlined />} onClick={runExecute} size='large' />
            </Flex>

            <Row gutter={[16, 16]}>
                <Col span={12} >
                    <b>&nbsp;Input Parameters</b>
                    <Editor height="60vh" language="json" theme="vs-dark"
                        value={inputs} onChange={updateInputs} />
                </Col>

                <Col span={12} >
                    <b>&nbsp;Returned Output</b>
                    <Editor height="60vh" language="json" theme="vs-dark"
                        value={outputs} />
                </Col>
            </Row>

        </div>
    )
};

export default Args;