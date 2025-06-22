import React from "react";
import "../../assets/styles/pages/_section.scss";

const newsList = [
    {
        id: 1,
        title: "EVENDO mở rộng hợp tác với các tổ chức quốc tế",
        date: "2025-06-20",
        content: "EVENDO vừa ký kết hợp tác chiến lược với các đơn vị tổ chức hội nghị quốc tế tại Châu Âu..."
    },
    {
        id: 2,
        title: "Hội nghị AI & Robotics 2025 thành công vượt mong đợi",
        date: "2025-06-10",
        content: "Sự kiện thu hút hơn 5.000 người tham dự cùng các diễn giả đến từ Google, NVIDIA và nhiều tập đoàn lớn."
    },
];

const sponsorList = [
    {
        id: 1,
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        website: "https://www.google.com"
    },
    {
        id: 2,
        logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
        website: "https://www.microsoft.com"
    },
    {
        id: 3,
        logo: "https://cdn.brandfetch.io/idMlb71WGO/w/800/h/273/theme/dark/logo.png?c=1dxbfHSJFAPEGdCLU4o5B",
        website: "https://fpt.com.vn"
    }
];

const NewsAndSponsorPage = () => {
    return (
        <div className="container py-5">
            {/* Sponsor bên trên */}
            <section className="animated fadeInUp mb-5">
                <h3 className="mb-4 fw-bold">Sponsor</h3>
                <div className="row g-4 justify-content-center">
                    {sponsorList.map(sponsor => (
                        <div className="col-6 col-md-6 col-lg-6 text-center" key={sponsor.id}>
                            <a href={sponsor.website} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={sponsor.logo}
                                    alt={sponsor.name}
                                    className="img-fluid mb-2"
                                    style={{ height: 50, width: 120, objectFit: 'contain' }}
                                />
                            </a>
                        </div>
                    ))}
                </div>
            </section>

            {/* Tin tức bên dưới */}
            <section className="animated fadeInUp mt-5">
                <h3 className="mb-3 fw-bold">News</h3>
                {newsList.map(news => (
                    <div key={news.id} className="mb-3 p-2 border rounded shadow-sm bg-white">
                        <h6 className="fw-semibold mb-1 small">{news.title}</h6>
                        <p className="text-muted mb-1 small">Ngày đăng: {news.date}</p>
                        <p className="mb-0 small">{news.content}</p>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default NewsAndSponsorPage;