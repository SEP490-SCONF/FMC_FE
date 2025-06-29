import React, { useContext, useRef, useState, useEffect } from 'react';
import { Button, DocumentLoadEvent, PdfJs, Position, PrimaryButton, Tooltip, Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import {
    highlightPlugin,
    MessageIcon,
} from '@react-pdf-viewer/highlight';
import { getPdfUrlByReviewId } from '../../../services/PaperRevisionService'; // import service
import { addReviewWithHighlightAndComment, getReviewWithHighlightAndComment } from '../../../services/ReviewWithHighlightService';

import { useUser } from '../../../context/UserContext'; // Đổi đường dẫn nếu cần

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const ReviewContent = ({ review }) => {
    const { user } = useUser(); // user chứa thông tin đăng nhập

    const [fileUrl, setFileUrl] = useState('');
    const [message, setMessage] = useState('');
    const [notes, setNotes] = useState([
        {
            id: 1,
            content: "hahaa",
            quote: "Vì thế Tuấn quyết định code thật nhiều để kiểm chứng hàm gcd có hoạt động tốt hay không",
            highlightAreas: [
                {
                    pageIndex: 0,
                    left: 7.889083440124753,
                    top: 23.747380774475992,
                    width: 74.86615689846838,
                    height: 1.453529080671501
                }
            ]
        }
    ]);
    const notesContainerRef = useRef(null);
    let noteId = notes.length;

    const [selectedHighlight, setSelectedHighlight] = useState(null);
    const [highlightEditContent, setHighlightEditContent] = useState('');

    const noteEles = useRef(new Map());
    const [currentDoc, setCurrentDoc] = useState(null);

    const handleDocumentLoad = (e) => {
        setCurrentDoc(e.doc);
        if (currentDoc && currentDoc !== e.doc) {
            setNotes([]);
        }
    };

    const renderHighlightTarget = (props) => (
        <div
            style={{
                background: '#eee',
                display: 'flex',
                position: 'absolute',
                left: `${props.selectionRegion.left}%`,
                top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
                transform: 'translate(0, 8px)',
                zIndex: 1,
            }}
        >
            <Tooltip
                position={Position.TopCenter}
                target={
                    <Button onClick={props.toggle}>
                        <MessageIcon />
                    </Button>
                }
                content={() => <div style={{ width: '100px' }}>Add a note</div>}
                offset={{ left: 0, top: -8 }}
            />
        </div>
    );

    const renderHighlightContent = (props) => {
        const addNote = async () => {
            if (message !== '') {
                const note = {
                    id: ++noteId,
                    content: message,
                    highlightAreas: props.highlightAreas,
                    quote: props.selectedText,
                };

                try {
                    const formData = new FormData();
                    formData.append("ReviewId", review.reviewId);
                    formData.append("RevisionId", review.revisionId);
                    formData.append("ReviewerId", user.userId);
                    formData.append("PageNumber", props.highlightAreas[0]?.pageIndex + 1);
                    formData.append("OffsetStart", props.highlightAreas[0]?.offsetStart || 0);
                    formData.append("OffsetEnd", props.highlightAreas[0]?.offsetEnd || 0);
                    formData.append("TextHighlighted", props.selectedText);
                    formData.append("UserId", user.userId);
                    formData.append("CommentText", message);
                    formData.append("Status", "Draft");

                    console.log("FormData gửi lên:", Object.fromEntries(formData.entries()));
                    await addReviewWithHighlightAndComment(formData);

                    setNotes((prev) => prev.concat([note]));
                    setMessage('');
                    props.cancel();
                } catch (err) {
                    alert("Lưu ghi chú thất bại!");
                }
            }
        };

        return (
            <div
                style={{
                    background: '#fff',
                    border: '1px solid rgba(0, 0, 0, .3)',
                    borderRadius: '2px',
                    padding: '8px',
                    position: 'absolute',
                    left: `${props.selectionRegion.left}%`,
                    top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
                    zIndex: 1,
                }}
            >
                <div>
                    <textarea
                        rows={3}
                        style={{
                            border: '1px solid rgba(0, 0, 0, .3)',
                        }}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                </div>
                <div
                    style={{
                        display: 'flex',
                        marginTop: '8px',
                    }}
                >
                    <div style={{ marginRight: '8px' }}>
                        <PrimaryButton onClick={addNote}>Add</PrimaryButton>
                    </div>
                    <Button onClick={props.cancel}>Cancel</Button>
                </div>
            </div>
        );
    };

    const [activateTab, setActivateTab] = useState(() => () => {});

    const jumpToNote = (note) => {
        activateTab(3);
        const notesContainer = notesContainerRef.current;
        if (noteEles.current.has(note.id) && notesContainer) {
            notesContainer.scrollTop = noteEles.current.get(note.id).getBoundingClientRect().top;
        }
    };

    const renderHighlights = (props) => (
    <div>
        {notes.map((note) => (
            <React.Fragment key={note.id}>
                {note.highlightAreas
                    .filter((area) => area.pageIndex === props.pageIndex) // Chỉ render trên trang hiện tại
                    .map((area, idx) => (
                        <div
                            key={idx}
                            style={{
                                position: 'absolute',
                                background: 'rgba(255, 255, 0, 0.4)', // Màu của highlight (vàng nhạt)
                                left: `${area.left}%`, // Vị trí x của highlight (tính từ trái)
                                top: `${area.top}%`,   // Vị trí y của highlight (tính từ trên)
                                width: `${area.width}%`,  // Chiều rộng của highlight
                                height: `${area.height}%`, // Chiều cao của highlight
                                pointerEvents: 'auto',  // Cho phép click vào highlight
                                zIndex: 2, // Đảm bảo highlight nổi lên trên text
                            }}
                            onClick={e => {
                                e.stopPropagation();
                                setSelectedHighlight({ note, area, pageIndex: props.pageIndex });
                                setHighlightEditContent(note.content);
                            }}
                        />
                    ))}
            </React.Fragment>
        ))}
    </div>
);


    const highlightPluginInstance = highlightPlugin({
        renderHighlightTarget,
        renderHighlightContent,
        renderHighlights,
    });

    const { jumpToHighlightArea } = highlightPluginInstance;

    useEffect(() => {
        return () => {
            noteEles.current.clear();
        };
    }, []);

    const handleDeleteNote = (id) => {
        setNotes(notes => notes.filter(note => note.id !== id));
    };

    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editingContent, setEditingContent] = useState('');

    const handleEditNote = (id) => {
        const note = notes.find(n => n.id === id);
        setEditingNoteId(id);
        setEditingContent(note.content);
    };

    // Khi render note, nếu đang edit thì show input
    const sidebarNotes = (
        <div
            ref={notesContainerRef}
            style={{
                overflow: 'auto',
                width: '100%',
            }}
        >
            {notes.length === 0 && <div style={{ textAlign: 'center' }}>There is no note</div>}
            {notes.map((note) => {
                return (
                    <div
                        key={note.id}
                        style={{
                            borderBottom: '1px solid rgba(0, 0, 0, .3)',
                            cursor: 'pointer',
                            padding: '8px',
                        }}
                        onClick={() => jumpToHighlightArea(note.highlightAreas[0])}
                        ref={(ref) => {
                            noteEles.current.set(note.id, ref);
                        }}
                    >
                        <blockquote
                            style={{
                                borderLeft: '2px solid rgba(0, 0, 0, 0.2)',
                                fontSize: '.75rem',
                                lineHeight: 1.5,
                                margin: '0 0 8px 0',
                                paddingLeft: '8px',
                                textAlign: 'justify',
                            }}
                        >
                            {note.quote}
                        </blockquote>
                        {editingNoteId === note.id ? (
                            <div>
                                <textarea
                                    value={editingContent}
                                    onChange={e => setEditingContent(e.target.value)}
                                />
                                <button onClick={() => {
                                    setNotes(notes => notes.map(n => n.id === note.id ? { ...n, content: editingContent } : n));
                                    setEditingNoteId(null);
                                }}>Save</button>
                                <button onClick={() => setEditingNoteId(null)}>Cancel</button>
                            </div>
                        ) : (
                            <>
                                {note.content}
                                <div style={{ marginTop: 8 }}>
                                    <button onClick={e => { e.stopPropagation(); handleEditNote(note.id); }}>Edit</button>
                                    <button onClick={e => { e.stopPropagation(); handleDeleteNote(note.id); }} style={{ marginLeft: 8 }}>Delete</button>
                                </div>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        transformToolbarSlot: (slot) => ({
            ...slot,
            Download: () => <></>,
            DownloadMenuItem: () => <></>,
            Print: () => <></>,
            PrintMenuItem: () => <></>,
            Open: () => <></>,
            OpenMenuItem: () => <></>,
            EnterFullScreen: () => <></>,
            EnterFullScreenMenuItem: () => <></>,
        }),
        sidebarTabs: (defaultTabs) =>
            defaultTabs.concat({
                content: sidebarNotes,
                icon: <MessageIcon />,
                title: 'Notes',
            }),
    });

    useEffect(() => {
    if (review && review.reviewId) {
        // Lấy file PDF
        getPdfUrlByReviewId(review.reviewId)
            .then(res => {
                if (res && res.pdfUrl) {
                    setFileUrl(res.pdfUrl);
                } else {
                    setFileUrl('');
                }
            })
            .catch(() => setFileUrl(''));

        // Lấy highlight và comment từ backend
        getReviewWithHighlightAndComment(review.reviewId)
            .then(res => {
                console.log("Dữ liệu BE trả về:", res); // Kiểm tra kết quả từ BE
                // if (res && res.highlights && res.comments) {
                //     // Kết hợp highlight và comment
                //     const notes = res.highlights.map(h => {
                //         // Tìm các comment liên quan đến highlight này
                //         const relatedComments = res.comments.filter(c => c.highlightId === h.highlightId);
                //         return {
                //             id: h.highlightId,
                //             content: relatedComments.length > 0 ? relatedComments[0].commentText : '',
                //             highlightAreas: [
                //                 {
                //                     pageIndex: h.pageNumber - 1, // Chuyển từ 1-based sang 0-based
                //                     // Nếu cần thêm các thông tin khác về highlight như top, left, width, height thì bạn có thể thêm vào đây
                //                 }
                //             ],
                //             quote: h.textHighlighted,
                //             comments: relatedComments, // Lưu các comment liên quan đến highlight
                //         };
                //     });
                //     setNotes(notes); // Lưu notes vào state
                // } else {
                //     setNotes([]); // Nếu không có dữ liệu, set danh sách rỗng
                // }
            })
            .catch(() => setNotes([])); // Xử lý lỗi nếu không lấy được dữ liệu
    }
}, [review]);

    return (
        <div style={{ height: '100%' }}>
            {/* Popup Edit/Delete khi chọn highlight */}
            {selectedHighlight && (
                <div
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        background: '#fff',
                        transform: 'translate(-50%, -50%)',
                        border: '1px solid #ccc',
                        padding: 12,
                        zIndex: 9999,
                        minWidth: 250,
                    }}
                >
                    <textarea
                        value={highlightEditContent}
                        onChange={e => setHighlightEditContent(e.target.value)}
                        style={{ width: '100%', marginBottom: 8 }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <button
                            onClick={() => {
                                setNotes(notes =>
                                    notes.map(n =>
                                        n.id === selectedHighlight.note.id
                                            ? { ...n, content: highlightEditContent }
                                            : n
                                    )
                                );
                                setSelectedHighlight(null);
                            }}
                        >
                            Save
                        </button>
                        <button
                            onClick={() => {
                                setNotes(notes => notes.filter(n => n.id !== selectedHighlight.note.id));
                                setSelectedHighlight(null);
                            }}
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => setSelectedHighlight(null)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                {fileUrl ? (
                    <Viewer
                        fileUrl={fileUrl}
                        plugins={[highlightPluginInstance, defaultLayoutPluginInstance]}
                        onDocumentLoad={handleDocumentLoad}
                    />
                ) : (
                    <div style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>
                        PDF not found or loading...
                    </div>
                )}
            </Worker>
        </div>
    );
};

export default ReviewContent;