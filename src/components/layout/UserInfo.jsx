import React from "react";
import "../../assets/styles/pages/_section.scss";

const user = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    avatar: "https://bootdey.com/img/Content/avatar/avatar7.png",
    role: "Full Stack Developer",
    location: "Bay Area, San Francisco, CA",
    phone: "(239) 816-9029",
    mobile: "(320) 380-4539",
    address: "Bay Area, San Francisco, CA",
    social: {
        website: "https://bootdey.com",
        github: "bootdey",
        twitter: "@bootdey",
        instagram: "bootdey",
        facebook: "bootdey"
    },
    projects: {
        "Web Design": 80,
        "Website Markup": 72,
        "One Page": 89,
        "Mobile Template": 55,
        "Backend API": 66
    }
};

const UserPage = () => {
    return (
        <div className="container py-5">
            <div className="row animated fadeInUp">
                {/* Left Column */}
                <div className="col-lg-4 mb-4">
                    <div className="card text-center p-4 h-100">
                        <img src={user.avatar} alt={user.name} className="rounded-circle mx-auto mb-3" width="120" />
                        <h5 className="mb-0 fw-bold">{user.name}</h5>
                        <span className="text-muted">{user.role}</span>
                        <p className="mt-2 text-muted">{user.location}</p>
                        <div className="d-flex justify-content-center gap-2 mb-3">
                            <button className="btn btn-primary">Follow</button>
                            <button className="btn btn-outline-primary">Message</button>
                        </div>
                        <ul className="list-group list-group-flush text-start">
                            <li className="list-group-item">Website: <a href={user.social.website}>{user.social.website}</a></li>
                            <li className="list-group-item">Github: {user.social.github}</li>
                            <li className="list-group-item">Twitter: {user.social.twitter}</li>
                            <li className="list-group-item">Instagram: {user.social.instagram}</li>
                            <li className="list-group-item">Facebook: {user.social.facebook}</li>
                        </ul>
                    </div>
                </div>

                {/* Right Column */}
                <div className="col-lg-8 d-flex flex-column gap-4">
                    <div className="card p-4">
                        <h5 className="mb-3">User Information</h5>
                        <div className="row">
                            <div className="col-sm-6 mb-2"><strong>Full Name:</strong> {user.name}</div>
                            <div className="col-sm-6 mb-2"><strong>Email:</strong> {user.email}</div>
                            <div className="col-sm-6 mb-2"><strong>Phone:</strong> {user.phone}</div>
                            <div className="col-sm-6 mb-2"><strong>Mobile:</strong> {user.mobile}</div>
                            <div className="col-12 mb-2"><strong>Address:</strong> {user.address}</div>
                        </div>
                        <button className="btn btn-info mt-2">Edit</button>
                    </div>

                    <div className="card p-4">
                        <h6 className="text-muted">assignment</h6>
                        <h5>Project Status</h5>
                        {Object.entries(user.projects).map(([project, percent], i) => (
                            <div key={i} className="mb-3">
                                <div className="d-flex justify-content-between">
                                    <span>{project}</span>
                                    <span>{percent}%</span>
                                </div>
                                <div className="progress">
                                    <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{ width: `${percent}%` }}
                                        aria-valuenow={percent}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserPage;
