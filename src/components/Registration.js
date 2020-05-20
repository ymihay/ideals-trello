import { Form, Input, Button, Checkbox } from 'antd';
import 'antd/dist/antd.css';

import React, { Component } from 'react'
import { Link } from "react-router-dom";
import axios from "axios";

const ES_URL = 'http://localhost:9200'

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

class Registration extends Component {
    render () {
        const onFinish = user => {
            console.log('Success:', user);
            const url =  `${ES_URL}/trello-users/default`
            axios
                .post(url,
                    user
                )
                .then(res => {
                    console.log(res)
                })
                .catch(error => {
                    console.error(error);
                });
        };

        const onFinishFailed = errorInfo => {
            console.log('Failed:', errorInfo);
        };

        return (
            <div style={{ 'display': 'flex', 'justify-content': 'center', 'margin-top': '50px' }}>
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            <Link to={'/board'}>
                                Submit
                            </Link>
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
};

export default Registration
