import React, { useState, useEffect } from 'react';
import {
  SubnodeOutlined,
  NodeIndexOutlined
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Col, Row } from 'antd';
import { Button } from 'antd';
import { Tabs } from 'antd';
import axios from 'axios';
const { Header, Content, Footer, Sider } = Layout;

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

function formatDocs(desc, params, docs, ret) {

  var act_ret = ret
  if (ret === '_empty') {
    act_ret = ret + ' ( None )'
  }

  return (
    <div>

      <b>Description</b>
      <pre style={{
        marginLeft: '30px'
      }}>
        {desc.join("\r\n")}
      </pre>

      <b>Arguments</b>
      <pre style={{
        marginLeft: '30px'
      }}>
        {params.join("\r\n")}
      </pre>

      <b>Usage</b>
      <pre style={{
        marginLeft: '30px'
      }}>
        {docs.join("\r\n")}
      </pre>

      <b>Returns</b>
      <pre style={{
        marginLeft: '30px'
      }}>
        {act_ret}
      </pre>

    </div>
  );

}

function formatArgs(kwargs) {

  console.log(kwargs)

  return (
    <div>

      {/* <b>Description</b>
      <pre style={{
        marginLeft: '30px'
      }}>
        {desc.join("\r\n")}
      </pre>

      <b>Arguments</b>
      <pre style={{
        marginLeft: '30px'
      }}>
        {params.join("\r\n")}
      </pre>

      <b>Usage</b>
      <pre style={{
        marginLeft: '30px'
      }}>
        {docs.join("\r\n")}
      </pre>

      <b>Returns</b>
      <pre style={{
        marginLeft: '30px'
      }}>
        {act_ret}
      </pre> */}

    </div>
  );

}

const App = () => {
  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [schema, setSchema] = useState([]);
  const [lastupdated, setLastUpdated] = useState("")
  const [breadcrumb, setBreadCrumbs] = useState([])
  const [tabs, setTabsContent] = useState([])

  useEffect(() => {
    axios.post('http://localhost:8000/docs/layer1', [], {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        setLastUpdated(response.data.time)
        addIcons([response.data.layer1])
        // console.log(JSON.stringify([response.data.layer1], null, 2))
        setSchema([response.data.layer1]);
        setBreadCrumbs([{ title: response.data.layer1.key }])
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const onSelectKey = (e) => {
    const breadcrumb = []
    const splitted = e.key.split('/')
    for (var i = 0, l = splitted.length; i < l; i++) {
      breadcrumb.push({ title: splitted[i] })
    }
    // console.log('click ', breadcrumb);
    setBreadCrumbs(breadcrumb)

    axios.post('http://localhost:8000/docs/' + e.key, ['desc', 'params', 'docs', 'kwargs', 'ret'], {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        const tabs = []
        const details = response.data[e.key]
        tabs.push({ key: 'Docs', label: 'Docs', children: formatDocs(details.desc, details.params, details.docs, details.ret) })
        tabs.push({ key: 'Args', label: 'Args', children: formatArgs(details.kwargs) })
        setTabsContent(tabs)
      })
      .catch(error => {
        console.error(error);
      });

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
              <Button type="primary">Reload Schema</Button>
            </Col>
          </Row>
        </Header>
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
