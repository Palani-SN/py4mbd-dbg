import Args from './args.js'
import Docs from './docs.js'

import React, { useState, useEffect } from 'react';
import { Breadcrumb, Layout, theme } from 'antd';
import { Tabs } from 'antd';
import axios from 'axios';
const { Content } = Layout;

const Contents = ({ urlpath, refresh }) => {

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [breadcrumb, setBreadCrumbs] = useState([])
    const [tabs, setTabsContent] = useState([])

    useEffect(() => {

        if (urlpath) {
            const breadcrumb = []
            const splitted = urlpath.split('/')
            for (var i = 0, l = splitted.length; i < l; i++) {
                breadcrumb.push({ title: splitted[i] })
            }
            setBreadCrumbs(breadcrumb)
            axios.post('http://localhost:8000/docs/' + urlpath, ['desc', 'params', 'docs', 'model', 'ret'], {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    var tabs = []
                    var inspected = response.data[urlpath]
                    const doc = {
                        name: inspected['key'],
                        desc: inspected['desc'],
                        params: inspected['params'],
                        docs: inspected['docs'],
                        ret: inspected['ret']
                    }

                    var api_inps = response.data[urlpath].model
                    const model = JSON.stringify([api_inps], null, 2)

                    tabs.push(
                        {
                            key: 'Args',
                            label: 'Args',
                            children:
                                <Args urlpath={urlpath} template={model} refresh={refresh}/>
                        })
                    tabs.push({ key: 'Docs', label: 'Docs', children: <Docs {...doc} refresh={refresh}/> })
                    setTabsContent(tabs)
                })
                .catch(error => {
                    console.error(error);
                });
        }

    }, [urlpath, refresh]);

    return (
        <div>

            <Content
                style={{
                    margin: '0 20px',
                }}
            >
                <Breadcrumb
                    style={{
                        margin: '20px 0'
                    }}
                    items={breadcrumb}
                />
                <div
                    style={{
                        paddingLeft: 24,
                        paddingRight: 24,
                        minHeight: 360,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Tabs defaultActiveKey="1" items={tabs} />
                </div>
            </Content>

        </div>
    )
};

export default Contents;