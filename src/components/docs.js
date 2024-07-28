import React from 'react';

const Docs = ({ name, desc, params, docs, ret, refresh }) => {

    if (name && desc && params && docs && ret) {

        var act_ret = ret
        if (ret === '_empty') {
            act_ret = ret + ' ( None )'
        }

        const vals = {
            name: name,
            desc: desc,
            params: params,
            docs: docs,
            ret: act_ret
        }

        return (
            <div>

                <div style={{
                    marginBottom: 14
                }}>
                    <i>
                        {vals.name}
                    </i>
                </div>

                <div style={{
                    marginLeft: '30px'
                }}>

                    <b>Description</b>
                    <pre style={{
                        marginLeft: '30px'
                    }}>
                        {vals.desc.join("\r\n")}
                    </pre>

                    <b>Arguments</b>
                    <pre style={{
                        marginLeft: '30px'
                    }}>
                        {vals.params.join("\r\n")}
                    </pre>

                    <b>Usage</b>
                    <pre style={{
                        marginLeft: '30px'
                    }}>
                        {vals.docs.join("\r\n")}
                    </pre>

                    <b>Returns</b>
                    <pre style={{
                        marginLeft: '30px'
                    }}>
                        {vals.ret}
                    </pre>

                </div>

            </div>

        )

    }
    else {
        return (

            <div>
                Docs
            </div>
        )
    }

};

export default Docs;