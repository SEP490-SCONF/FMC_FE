import React, { useRef, useState, useEffect } from 'react';
import { Button, DocumentLoadEvent, PdfJs, Position, PrimaryButton, Tooltip, Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import {
    highlightPlugin,
    MessageIcon,
} from '@react-pdf-viewer/highlight';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const ReviewContent = () => {
    const fileUrl = '/pdf-open-parameters.pdf';
    const [message, setMessage] = useState('');
    const [notes, setNotes] = useState([]);
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
        const addNote = () => {
            if (message !== '') {
                const note = {
                    id: ++noteId,
                    content: message,
                    highlightAreas: props.highlightAreas,
                    quote: props.selectedText,
                };
                setNotes((prev) => prev.concat([note]));
                setMessage('');
                props.cancel();
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
                    .filter((area) => area.pageIndex === props.pageIndex)
                    .map((area, idx) => (
                        <div
                            key={idx}
                            style={Object.assign(
                                {},
                                {
                                    background: 'red',
                                    opacity: 0.4,
                                    cursor: 'pointer',
                                    position: 'absolute', // Đảm bảo highlight nằm trên text
                                    zIndex: 2,            // Đảm bảo highlight nổi lên trên
                                    pointerEvents: 'auto' // Cho phép click
                                },
                                props.getCssProperties(area, props.rotation)
                            )}
                            onClick={e => {
                                e.stopPropagation();
                                setSelectedHighlight({ note, area, pageIndex: props.pageIndex, position: area });
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
                    }}
                >
                    <textarea
                        value={highlightEditContent}
                        onChange={e => setHighlightEditContent(e.target.value)}
                    />
                    <div style={{ marginTop: 8 }}>
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
                            style={{ marginLeft: 8 }}
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => setSelectedHighlight(null)}
                            style={{ marginLeft: 8 }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer
                    fileUrl={fileUrl}
                    plugins={[highlightPluginInstance, defaultLayoutPluginInstance]}
                    onDocumentLoad={handleDocumentLoad}
                />
            </Worker>
        </div>
    );
};

export default ReviewContent;