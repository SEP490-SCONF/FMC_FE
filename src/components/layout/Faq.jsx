import React from 'react';
import '../../assets/styles/pages/_section.scss';

// Import images
import faqShape from '../../assets/images/shape/faq-shape.png';

const faqs = [
    {
        question: '1. How can I book an event with you?',
        answer: 'Simply fill out our contact form or call us directly. Our team will guide you through the process.',
    },
    {
        question: '2. How can I schedule an event with you?',
        answer: 'You can schedule an event by filling out our online form or by giving us a call. We are happy to assist.',
    },
    {
        question: '3. How do I get a quote for my event?',
        answer: 'Booking an event is easy! Simply fill out our contact form, or call us to start the process and get your questions answered.',
    },
    {
        question: '4. What is your cancellation policy?',
        answer: 'You can secure your event by filling out our form or calling us. We’ll guide you through every step to ensure your event is set up.',
    },
    {
        question: '5. How can I arrange an event with you?',
        answer: 'To arrange an event, simply complete the contact form or give us a call. We will help you through the entire process.',
    },
    {
        question: '6. How do I book an event?',
        answer: "To book an event, simply complete our online form or contact us directly. We'll guide you through the next steps.",
    },
    {
        question: '7. How can I book my event with you?',
        answer: 'You can book your event by filling out our contact form or calling us. Our team will assist with every detail.',
    },
    {
        question: '8. What steps are booking an event?',
        answer: "Booking an event is simple! Just fill out the form or contact us directly, and we'll walk you through every step.",
    },
];

const FaqSection = () => (
    <section className="cmn-faq faq-section s1-bg-color pt-120 pb-120">
        <div className="container">
            <div className="row gy-0 justify-content-between align-items-center">
                <div className="col-lg-6 ps-3 ps-xl-20">
                    <div className="section-area mb-6 mb-md-10 d-grid gap-3 gap-md-4 reveal-single reveal-text text-three">
                        <span className="p7-color fw-semibold">FAQs</span>
                        <h2 className="fs-two">Frequently Asked Questions</h2>
                    </div>
                    <div className="img-area transition rounded-circle faq-shape">
                        <img src={faqShape} alt="faq shape" />
                    </div>
                </div>
                <div className="col-lg-6 order-1 order-lg-0">
                    {faqs.map((faq, idx) => (
                        <div
                            className={`accordion-single position-relative d-grid flex-column s1-bg-color py-4 py-md-6 px-4 px-md-6${idx === 0 ? ' active' : ''}`}
                            key={idx}
                        >
                            <h5 className="header-area">
                                <button
                                    className="accordion-btn text-start n2-color fw-bold d-flex align-items-center position-relative w-100"
                                    type="button"
                                >
                                    {faq.question}
                                </button>
                            </h5>
                            <div className="content-area z-1">
                                <div className="content-body pt-3 pt-md-4">
                                    <p className="n3-color">{faq.answer}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

export default FaqSection;