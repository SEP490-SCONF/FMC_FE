import React, { useEffect, useState } from 'react';
import { Card, Table, Button } from 'antd';
import { Column } from '@ant-design/charts';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const OrganizerTrackIncome = ({ payments }) => {
    const [chartData, setChartData] = useState([]);
    const [allPayments, setAllPayments] = useState([]);

    const formatNumberWithDots = (value) => {
        if (value === null || value === undefined) return '0';
        const num = typeof value === 'number' ? value : Number(value) || 0;
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    useEffect(() => {
        if (payments && payments.length > 0) {
            const completedPayments = payments.filter(p => p.payStatus === 'Completed');

            const aggregatedData = completedPayments.reduce((acc, payment) => {
                const date = payment.paidAt
                    ? new Date(payment.paidAt).toISOString().slice(0, 10)
                    : new Date(payment.createdAt).toISOString().slice(0, 10);

                if (!acc[date]) acc[date] = 0;
                acc[date] += payment.amount || 0;
                return acc;
            }, {});

            const chartDataArray = Object.keys(aggregatedData).map(date => ({
                date,
                totalAmount: aggregatedData[date],
            }));

            setChartData(chartDataArray);
            setAllPayments(payments);
        } else {
            setChartData([]);
            setAllPayments([]);
        }
    }, [payments]);

    const chartConfig = {
        data: chartData,
        xField: 'date',
        yField: 'totalAmount',
        columnWidthRatio: 0.25,
        maxColumnWidth: 60,
        columnStyle: {
            fill: 'l(270) 0:#1890ff 1:#69c0ff',
            radius: [4, 4, 0, 0],
        },
        appendPadding: [20, 20, 40, 20],
        tooltip: {
            title: 'Date',
            showTitle: true,
            formatter: (datum) => {
                const value = datum && datum.totalAmount ? datum.totalAmount : 0;
                return {
                    name: 'Total Amount',
                    value: `${formatNumberWithDots(value)} VND`,
                };
            },
        },
        xAxis: {
            label: { autoHide: true, autoRotate: false },
        },
        yAxis: {
            label: {
                formatter: (v) => formatNumberWithDots(v),
            },
        },
        meta: {
            date: { alias: 'Transfer Date' },
            totalAmount: { alias: 'Total Amount' },
        },
        interactions: [{ type: 'element-active' }],
        label: null,
    };

    const tableColumns = [
        { title: 'Payment ID', dataIndex: 'payId', key: 'payId' },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (text) => `${formatNumberWithDots(text)} VND`,
        },
        {
            title: 'Date',
            dataIndex: 'paidAt',
            key: 'paidAt',
            render: (text, record) => {
                const rawDate = text || record.createdAt;
                return rawDate ? new Date(rawDate).toISOString().slice(0, 10) : '-';
            },
        },
        {
            title: 'Status',
            dataIndex: 'payStatus',
            key: 'payStatus',
            render: (text) => {
                const style = {
                    padding: '4px 8px',
                    borderRadius: '4px',
                    display: 'inline-block',
                    textAlign: 'center',
                    color: 'black',
                    backgroundColor:
                        text === 'Completed'
                            ? '#d4edda'
                            : text === 'Pending'
                                ? '#fff3cd'
                                : text === 'Cancelled'
                                    ? '#f8d7da'
                                    : '#e9ecef',
                };
                return <span style={style}>{text}</span>;
            },
        },
        { title: 'Purpose', dataIndex: 'purpose', key: 'purpose' },
        { title: 'User', dataIndex: 'userName', key: 'userName' },
    ];

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(allPayments);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Payments');
        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
        });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'payments.xlsx');
    };

    return (
        <>
            <Card
                title="📊 Total Amount Transferred by Date (Completed)"
                variant={false}
                style={{
                    borderRadius: 8,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    marginBottom: 20,
                }}
            >
                <Column {...chartConfig} height={400} />
            </Card>

            <Card
                title="List of All Payments"
                variant={false}
                style={{
                    borderRadius: 8,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
                extra={<Button type="primary" onClick={exportToExcel}>Export Excel</Button>}
            >
                <Table
                    columns={tableColumns}
                    dataSource={allPayments}
                    rowKey="payId"
                    pagination={{ pageSize: 5 }}
                />
            </Card>
        </>
    );
};

export default OrganizerTrackIncome;
