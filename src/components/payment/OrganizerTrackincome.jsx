import React, { Component } from 'react';
import { Card } from 'antd';
import { Column } from '@ant-design/charts';

class OrganizerTrackincome extends Component {
    state = {
        data: [
            { date: '2025-08-01', amount: 5000000 },
            { date: '2025-08-02', amount: 3000000 },
            { date: '2025-08-03', amount: 7000000 },
        ],
    };

    render() {
        const config = {
            data: this.state.data,
            xField: 'date',
            yField: 'amount',
            columnStyle: {
                fill: 'l(270) 0:#1890ff 1:#69c0ff', // gradient
                radius: [4, 4, 0, 0], // bo góc cột
            },
            tooltip: {
                formatter: (datum) => ({
                    name: 'Số tiền chuyển',
                    value: `${datum.amount.toLocaleString()} VNĐ`,
                }),
            },
            xAxis: {
                label: { autoHide: true, autoRotate: false },
            },
            yAxis: {
                label: {
                    formatter: (v) => `${Number(v).toLocaleString()} VNĐ`,
                },
            },
            meta: {
                date: { alias: 'Ngày chuyển' },
                amount: { alias: 'Số tiền chuyển' },
            },
            interactions: [{ type: 'element-active' }], // hover hiệu ứng
        };

        return (
            <Card
                title="📊 Biểu đồ số tiền đã chuyển"
                bordered={false}
                style={{ borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            >
                <Column {...config} height={400} />
            </Card>
        );
    }
}

export default OrganizerTrackincome;
