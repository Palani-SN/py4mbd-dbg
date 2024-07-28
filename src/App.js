
import React, { useState, useEffect } from 'react';
import {
    SubnodeOutlined,
    NodeIndexOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { Col, Row } from 'antd';
import { Button } from 'antd';
import axios from 'axios';
import Contents from './components/contents.js'
const { Header, Footer, Sider } = Layout;

function addIcons(children) {

    for (var i = 0, l = children.length; i < l; i++) {
        var obj = children[i];
        if (obj.type === 'obj') {
            obj.icon = <SubnodeOutlined />
            addIcons(obj.children)
        }
        if (obj.type === 'func') {
            obj.icon = <NodeIndexOutlined />
        }
    }
}

const App = () => {

    const [collapsed, setCollapsed] = useState(true);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const [schema, setSchema] = useState([]);
    const [lastupdated, setLastUpdated] = useState("")
    const [urlpath, setURLPath] = useState("")
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {

        axios.post('http://localhost:8000/docs/layer1', [], {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                setLastUpdated(response.data.time)
                addIcons([response.data.layer1])
                setSchema([{ 'key': 'refresh', 'label': 'refresh', 'icon': <ReloadOutlined /> }, response.data.layer1]);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const reloadSchema = () => {
        if (urlpath) {
            setRefresh(!refresh)
        }
    };

    const onSelectKey = (e) => {
        if (e.key === 'refresh') {
            axios.post('http://localhost:8000/docs/layer1', [], {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    setLastUpdated(response.data.time)
                    addIcons([response.data.layer1])
                    setSchema([{ 'key': 'refresh', 'label': 'refresh', 'icon': <ReloadOutlined /> }, response.data.layer1]);
                })
                .catch(error => {
                    console.error(error);
                });
        }
        else {
            setURLPath(e.key)
        }
    };

    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <Menu onClick={onSelectKey} theme="dark" defaultSelectedKeys={['1']} mode="inline" items={schema} />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                >
                    <Row justify="space-between" align="middle" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                        <Col span={12} style={{ textAlign: 'left' }}>
                            <b>last updated time : {lastupdated}</b>
                        </Col>
                        <Col span={12} style={{ textAlign: 'right' }}>
                            <Button type="primary" shape="circle" icon={<ReloadOutlined />} onClick={reloadSchema} size='large' />
                        </Col>
                    </Row>
                </Header>
                <Contents
                    urlpath={urlpath}
                    refresh={refresh}
                />
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Footer>
            </Layout>
        </Layout>
    );
};

export default App;