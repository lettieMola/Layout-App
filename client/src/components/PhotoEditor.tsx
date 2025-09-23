import React, { useRef, useState, useEffect } from 'react';
import ToolBar from './ToolBar';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import StickerPicker from './StickerPicker';
import ImageThumbnails from './ImageThumbnails';
import AnimatedSticker from '@/components/AnimatedSticker';
import { percentToPx, pxToPercent, angleBetween, clampPercent } from '@/lib/positionUtils';

type ImageItem = {
	id: string;
	src: string;
	filter?: string;
	brightness?: number;
	contrast?: number;
	rotation?: number;
	flippedX?: boolean;
	flippedY?: boolean;
	x?: number;
	y?: number;
	width?: number;
	height?: number;
};

type Sticker = { id: string; src: string; x: number; y: number; width: number; height: number; rotation?: number; animated?: boolean };
type TextItem = { id: string; text: string; x: number; y: number; fontSize: number; color: string; fontFamily: string; rotation?: number };

const DEMO_STICKERS: Sticker[] = [
	{ id: 'star', src: '/public/icon-192.png', x: 20, y: 20, width: 60, height: 60 },
];

const DEMO_LAYOUTS = [
	{ id: 'grid-2', name: 'Two', cells: [{ x: 0, y: 0, width: 50, height: 100 }, { x: 50, y: 0, width: 50, height: 100 }] },
	{ id: 'grid-3', name: 'Three', cells: [{ x: 0, y: 0, width: 33.33, height: 100 }, { x: 33.33, y: 0, width: 33.33, height: 100 }, { x: 66.66, y: 0, width: 33.33, height: 100 }] },
];

const DEMO_FONTS = ['Arial', 'Georgia', 'Helvetica', 'Times New Roman'];

const PhotoEditor: React.FC = () => {
	const canvasRef = useRef<HTMLDivElement | null>(null);
	const [images, setImages] = useState<ImageItem[]>([]);
		// x/y for stickers and texts are stored as percent (0-100) relative to canvas
		const [stickers, setStickers] = useState<Sticker[]>([]);
		const [texts, setTexts] = useState<TextItem[]>([]);
		const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
		const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
		const rotatePointer = useRef<{ rotating: boolean; startAngle?: number; origRotation?: number; cx?: number; cy?: number }>({ rotating: false });
	const [activeTab, setActiveTab] = useState<string>('layout');
	const [selectedLayout, setSelectedLayout] = useState<any>(DEMO_LAYOUTS[0]);
	const [aspectRatio, setAspectRatio] = useState<number>(1);
	const [selectedFilter, setSelectedFilter] = useState<string>('');
	const [editingImageIdx, setEditingImageIdx] = useState<number | null>(null);
	const [editingStickerIdx, setEditingStickerIdx] = useState<number | null>(null);
	const [editingTextIdx, setEditingTextIdx] = useState<number | null>(null);

	// Simple undo/redo stacks (store snapshots)
	const [history, setHistory] = useState<any[]>([]);
	const [future, setFuture] = useState<any[]>([]);
	const pushHistory = () => {
		setHistory(h => [...h, { images, stickers, texts, selectedLayout, aspectRatio }]);
		setFuture([]);
	};
	const undo = () => {
		if (history.length === 0) return;
		const prev = history[history.length - 1];
		setFuture(f => [{ images, stickers, texts, selectedLayout, aspectRatio }, ...f]);
		setHistory(h => h.slice(0, h.length - 1));
		setImages(prev.images);
		setStickers(prev.stickers);
		setTexts(prev.texts);
		setSelectedLayout(prev.selectedLayout ?? DEMO_LAYOUTS[0]);
		setAspectRatio(prev.aspectRatio ?? 1);
	};
	const redo = () => {
		if (future.length === 0) return;
		const next = future[0];
		setFuture(f => f.slice(1));
		setHistory(h => [...h, { images, stickers, texts, selectedLayout, aspectRatio }]);
		setImages(next.images);
		setStickers(next.stickers);
		setTexts(next.texts);
		setSelectedLayout(next.selectedLayout ?? DEMO_LAYOUTS[0]);
		setAspectRatio(next.aspectRatio ?? 1);
	};

	// Image import
	const handleImageImport = async () => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.multiple = true;
		input.onchange = (e: any) => {
			const files: FileList = e.target.files;
			if (!files) return;
			pushHistory();
			const arr: ImageItem[] = [];
			Array.from(files).forEach((file, idx) => {
				const reader = new FileReader();
				reader.onload = (ev) => {
					const src = ev.target?.result as string;
					arr.push({ id: Date.now().toString() + idx, src, brightness: 1, contrast: 1, rotation: 0, flippedX: false, flippedY: false });
					if (arr.length === files.length) setImages(prev => [...prev, ...arr]);
				};
				reader.readAsDataURL(file);
			});
		};
		input.click();
	};

			const handleAddSticker = (src: string) => {
				pushHistory();
				// default center-ish percent coordinates
				setStickers(s => [...s, { id: Date.now().toString(), src, x: 10, y: 10, width: 60, height: 60 }]);
			};

	const handleAddText = (text: string) => {
		pushHistory();
		setTexts(t => [...t, { id: Date.now().toString(), text, x: 10, y: 10, fontSize: 24, color: '#222', fontFamily: DEMO_FONTS[0] }]);
	};


	  // Small helpers: bounded draggable and resizable wrappers
	  const getCanvasRect = () => canvasRef.current?.getBoundingClientRect() ?? null;

		// clamp in px space
		const clampPositionToCanvas = (x: number, y: number, width = 0, height = 0) => {
			const rect = getCanvasRect();
			if (!rect) return { x, y };
			const clampedX = Math.max(0, Math.min(x, rect.width - width));
			const clampedY = Math.max(0, Math.min(y, rect.height - height));
			return { x: clampedX, y: clampedY };
		};

		// Convert px drag position to percent and store
		function handleStickerDragStop(e: DraggableEvent, data: DraggableData, idx: number) {
			const st = stickers[idx];
			if (!st) return;
			const rect = getCanvasRect();
			if (!rect) return;
			const px = clampPositionToCanvas(data.x, data.y, st.width ?? 0, st.height ?? 0);
			const nx = (px.x / rect.width) * 100;
			const ny = (px.y / rect.height) * 100;
			setStickers(s => s.map((it, i) => i === idx ? { ...it, x: nx, y: ny } : it));
			pushHistory();
		}

		function handleStickerDrag(e: DraggableEvent, data: DraggableData, idx: number) {
			const st = stickers[idx];
			if (!st) return;
			const rect = getCanvasRect();
			if (!rect) return;
			const px = clampPositionToCanvas(data.x, data.y, st.width ?? 0, st.height ?? 0);
			const nx = (px.x / rect.width) * 100;
			const ny = (px.y / rect.height) * 100;
			setStickers(s => s.map((it, i) => i === idx ? { ...it, x: nx, y: ny } : it));
		}

		function handleStickerResizeStop(event: MouseEvent | TouchEvent | Event, idx: number, size: { width: number; height: number }) {
			setStickers(s => s.map((it, i) => i === idx ? { ...it, width: Math.max(20, size.width), height: Math.max(20, size.height) } : it));
			pushHistory();
		}

		function handleTextDragStop(e: DraggableEvent, data: DraggableData, idx: number) {
			const t = texts[idx];
			if (!t) return;
			const rect = getCanvasRect();
			if (!rect) return;
			const px = clampPositionToCanvas(data.x, data.y);
			const nx = (px.x / rect.width) * 100;
			const ny = (px.y / rect.height) * 100;
			setTexts(ts => ts.map((it, i) => i === idx ? { ...it, x: nx, y: ny } : it));
			pushHistory();
		}

		// Rotate handling (pointer events on rotate handle)
		const onRotatePointerDown = (e: React.PointerEvent, idx: number, isSticker: boolean) => {
			const rect = canvasRef.current?.getBoundingClientRect();
			if (!rect) return;
			e.currentTarget.setPointerCapture(e.pointerId);
			const cx = rect.left + rect.width / 2;
			const cy = rect.top + rect.height / 2;
			const target = isSticker ? stickers[idx] : texts[idx];
			rotatePointer.current = { rotating: true, startAngle: angleBetween(cx, cy, e.clientX, e.clientY), origRotation: target.rotation ?? 0, cx, cy };
		};

		const onRotatePointerMove = (e: PointerEvent) => {
			if (!rotatePointer.current.rotating) return;
			const { cx, cy, startAngle, origRotation } = rotatePointer.current as any;
			const ang = angleBetween(cx, cy, e.clientX, e.clientY);
			const delta = ang - startAngle;
			const newRot = ((origRotation ?? 0) + delta + 360) % 360;
			// apply to selected sticker/text
			if (selectedStickerId) {
				setStickers(s => s.map(st => st.id === selectedStickerId ? { ...st, rotation: newRot } : st));
			} else if (selectedTextId) {
				setTexts(t => t.map(tx => tx.id === selectedTextId ? { ...tx, rotation: newRot } : tx));
			}
		};

		const onRotatePointerUp = () => {
			if (rotatePointer.current.rotating) pushHistory();
			rotatePointer.current = { rotating: false };
		};

		useEffect(() => {
			window.addEventListener('pointermove', onRotatePointerMove);
			window.addEventListener('pointerup', onRotatePointerUp);
			return () => {
				window.removeEventListener('pointermove', onRotatePointerMove);
				window.removeEventListener('pointerup', onRotatePointerUp);
			};
		}, [selectedStickerId, selectedTextId]);

			// Keyboard shortcuts: nudge, delete, duplicate
			useEffect(() => {
				const onKey = (e: KeyboardEvent) => {
					if (!selectedStickerId && !selectedTextId) return;
					const isSticker = !!selectedStickerId;
					const stepPx = 5; // pixels to nudge
					if (e.key === 'Delete' || e.key === 'Backspace') {
						pushHistory();
						if (isSticker) setStickers(s => s.filter(st => st.id !== selectedStickerId));
						else setTexts(t => t.filter(tx => tx.id !== selectedTextId));
						setSelectedStickerId(null);
						setSelectedTextId(null);
						return;
					}
					if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
						// duplicate
						pushHistory();
						if (isSticker) {
							const st = stickers.find(s => s.id === selectedStickerId);
							if (!st) return;
							const copy = { ...st, id: Date.now().toString() };
							setStickers(s => [...s, copy]);
						} else {
							const tx = texts.find(t => t.id === selectedTextId);
							if (!tx) return;
							const copy = { ...tx, id: Date.now().toString() };
							setTexts(t => [...t, copy]);
						}
						return;
					}
					// arrow nudges: convert percent to px, nudge, convert back
					const rect = getCanvasRect();
					if (!rect) return;
					const stepPercentX = (stepPx / rect.width) * 100;
					const stepPercentY = (stepPx / rect.height) * 100;
					if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
						pushHistory();
						const dx = e.key === 'ArrowLeft' ? -stepPercentX : e.key === 'ArrowRight' ? stepPercentX : 0;
						const dy = e.key === 'ArrowUp' ? -stepPercentY : e.key === 'ArrowDown' ? stepPercentY : 0;
						if (isSticker) {
							setStickers(s => s.map(st => st.id === selectedStickerId ? { ...st, x: clampPercent((st.x ?? 0) + dx), y: clampPercent((st.y ?? 0) + dy) } : st));
						} else {
							setTexts(t => t.map(tx => tx.id === selectedTextId ? { ...tx, x: clampPercent((tx.x ?? 0) + dx), y: clampPercent((tx.y ?? 0) + dy) } : tx));
						}
					}
				};
				window.addEventListener('keydown', onKey);
				return () => window.removeEventListener('keydown', onKey);
			}, [selectedStickerId, selectedTextId, stickers, texts]);

	// react-draggable's default export doesn't always appear to be a JSX component
	// to TS depending on ES module interop settings. Cast it to a React component
	// type to use in JSX safely.
	const DraggableAny = (Draggable as unknown) as React.ComponentType<any>;


		// Simple async upscaler placeholder
			const UPSCALER_ENDPOINT = '';
			const enhanceImage = async (idx: number, scale: 2 | 3) => {
				const img = images[idx];
				if (!img) return;
				pushHistory();
				if (UPSCALER_ENDPOINT) {
					try {
						const resp = await fetch(UPSCALER_ENDPOINT, { method: 'POST', body: JSON.stringify({ image: img.src, scale }), headers: { 'Content-Type': 'application/json' } });
						const data = await resp.json();
						if (data?.url) setImages(imgs => imgs.map((im, i) => i === idx ? { ...im, src: data.url } : im));
						return;
					} catch (e) {
						console.warn('Upscaler call failed', e);
					}
				}
				// Fallback simulated upscaler
				await new Promise(res => setTimeout(res, 1200));
				setImages(imgs => imgs.map((im, i) => i === idx ? { ...im, src: im.src + `#upscaled_${scale}x` } : im));
			};

	const handleExport = async () => {
		if (!canvasRef.current) return;
		const html2canvas = (await import('html2canvas')).default;
		const c = await html2canvas(canvasRef.current);
		const dataUrl = c.toDataURL('image/png');
		const link = document.createElement('a');
		link.href = dataUrl;
		link.download = 'collage.png';
		link.click();
	};

	const saveProject = () => {
		const payload = { images, stickers, texts, selectedLayout, aspectRatio };
		localStorage.setItem('layoutforge.project', JSON.stringify(payload));
		alert('Saved locally');
	};
	const loadProject = () => {
		const raw = localStorage.getItem('layoutforge.project');
		if (!raw) return alert('No saved project');
		const data = JSON.parse(raw);
		setImages(data.images || []);
		setStickers(data.stickers || []);
		setTexts(data.texts || []);
		setSelectedLayout(data.selectedLayout || DEMO_LAYOUTS[0]);
		setAspectRatio(data.aspectRatio || 1);
	};

	// Single tool panel renderer
	const renderToolPanel = () => {
		switch (activeTab) {
			case 'layout':
				return (
					<div className="space-y-2">
						<div className="font-semibold mb-2">Choose Layout</div>
						{DEMO_LAYOUTS.map((layout) => (
							<button key={layout.id} className={`px-3 py-1 rounded border ${selectedLayout.id === layout.id ? 'bg-primary text-white' : 'bg-white'}`} onClick={() => { pushHistory(); setSelectedLayout(layout); }}>{layout.name}</button>
						))}
					</div>
				);
			case 'filters':
				return (
					<div className="space-y-2">
						<div className="font-semibold mb-2">Filters</div>
						{[ '', 'grayscale(1)', 'sepia(1)', 'contrast(1.2)', 'brightness(1.2)' ].map(f => (
							<button key={f} className={`px-3 py-1 rounded border ${selectedFilter === f ? 'bg-primary text-white' : 'bg-white'}`} onClick={() => setSelectedFilter(f)}>{f || 'None'}</button>
						))}
						<div className="mt-2">
							<div className="font-semibold mb-2">Edit Selected Image</div>
							{editingImageIdx !== null && images[editingImageIdx] && (
								<div className="space-y-2">
									<label className="block text-xs">Brightness: {images[editingImageIdx].brightness}</label>
									<input type="range" min="0.5" max="2" step="0.01" value={images[editingImageIdx].brightness ?? 1} onChange={e => {
										const v = parseFloat(e.target.value);
										setImages(imgs => imgs.map((im, i) => i === editingImageIdx ? { ...im, brightness: v } : im));
									}} />
									<label className="block text-xs">Contrast: {images[editingImageIdx].contrast}</label>
									<input type="range" min="0.5" max="2" step="0.01" value={images[editingImageIdx].contrast ?? 1} onChange={e => {
										const v = parseFloat(e.target.value);
										setImages(imgs => imgs.map((im, i) => i === editingImageIdx ? { ...im, contrast: v } : im));
									}} />
									<div className="flex gap-2">
										<button className="px-2 py-1 border rounded" onClick={() => setImages(imgs => imgs.map((im, i) => i === editingImageIdx ? { ...im, rotation: ((im.rotation ?? 0) + 90) % 360 } : im))}>Rotate</button>
										<button className="px-2 py-1 border rounded" onClick={() => setImages(imgs => imgs.map((im, i) => i === editingImageIdx ? { ...im, flippedX: !im.flippedX } : im))}>Flip X</button>
									</div>
								</div>
							)}
							<div className="mt-2">
								{images.map((im, i) => (<button key={im.id} className="block w-full text-left px-2 py-1 border rounded mb-1" onClick={() => setEditingImageIdx(i)}>Image {i+1}</button>))}
							</div>
						</div>
					</div>
				);
					case 'stickers':
								return (
									<StickerPicker
										stickers={DEMO_STICKERS.map(s => ({ id: s.id, src: s.src }))}
										onSelect={(src, animated) => handleAddSticker(src)}
									/>
								);
			case 'text':
				return (
					<div className="space-y-2">
						<div className="font-semibold mb-2">Text</div>
						<button className="px-3 py-1 rounded border bg-white" onClick={() => handleAddText('Sample Text')}>Add Sample Text</button>
					</div>
				);
			case 'presets':
				return <div className="text-sm">Presets (save/load)</div>;
			case 'share':
				return (
					<div className="space-y-2">
						<button className="w-full px-3 py-1 rounded bg-primary text-white" onClick={handleExport}>Export PNG</button>
						<button className="w-full px-3 py-1 rounded border" onClick={saveProject}>Save</button>
						<button className="w-full px-3 py-1 rounded border" onClick={loadProject}>Load</button>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen bg-background flex flex-col">
			<ToolBar
				className="sticky top-0 z-10 mb-2"
				onUndo={undo}
				onRedo={redo}
				onReset={() => {
					if (window.confirm('Reset the editor? This will clear your work.')) {
						setImages([]);
						setStickers([]);
						setTexts([]);
						setHistory([]);
						setFuture([]);
						setSelectedLayout(DEMO_LAYOUTS[0]);
						setAspectRatio(1);
					}
				}}
				onSave={saveProject}
				onDownload={handleExport}
				canUndo={history.length > 0}
				canRedo={future.length > 0}
			/>

			<div className="flex gap-6 p-6">
				<div className="w-64 bg-gray-50 rounded-lg p-4 shadow h-fit">
					<button className="w-full mb-4 px-3 py-1 rounded bg-primary text-white" onClick={handleImageImport}>Select Photos</button>
					<div className="flex flex-wrap gap-2 mb-4">
						<button className={`flex-1 px-2 py-1 rounded ${activeTab === 'layout' ? 'bg-primary text-white' : 'bg-white'}`} onClick={() => setActiveTab('layout')}>Layout</button>
						<button className={`flex-1 px-2 py-1 rounded ${activeTab === 'filters' ? 'bg-primary text-white' : 'bg-white'}`} onClick={() => setActiveTab('filters')}>Filters</button>
						<button className={`flex-1 px-2 py-1 rounded ${activeTab === 'stickers' ? 'bg-primary text-white' : 'bg-white'}`} onClick={() => setActiveTab('stickers')}>Stickers</button>
						<button className={`flex-1 px-2 py-1 rounded ${activeTab === 'text' ? 'bg-primary text-white' : 'bg-white'}`} onClick={() => setActiveTab('text')}>Text</button>
						<button className={`flex-1 px-2 py-1 rounded ${activeTab === 'share' ? 'bg-primary text-white' : 'bg-white'}`} onClick={() => setActiveTab('share')}>Share</button>
					</div>
					{renderToolPanel()}
					<div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded shadow-sm">
						<div className="font-semibold mb-2 text-blue-900">Tips</div>
						<ul className="list-disc pl-5 text-sm text-blue-900 space-y-1">
							<li><b>Choose a Theme:</b> Use consistent colors.</li>
							<li><b>High-Quality Photos:</b> Use sharp, well-lit images.</li>
							<li><b>Keep It Simple:</b> Avoid overcrowding.</li>
						</ul>
					</div>
				</div>

				<div className="flex-1 bg-white rounded-lg shadow p-4 min-h-[500px] relative overflow-auto flex items-center justify-center">
					<div ref={canvasRef} className="relative w-full h-full" style={{ aspectRatio: `${aspectRatio}/1`, maxWidth: 900, maxHeight: 900 }}>
						{selectedLayout.cells.map((cell: any, idx: number) => {
							const img = images[idx];
							if (!img) return (
								<div key={idx} className="absolute border border-dashed border-gray-200 rounded" style={{ left: `${cell.x}%`, top: `${cell.y}%`, width: `${cell.width}%`, height: `${cell.height}%` }} />
							);
							const filterStr = [img.filter || selectedFilter || '', `brightness(${img.brightness ?? 1})`, `contrast(${img.contrast ?? 1})`].filter(Boolean).join(' ');
							const transformStr = `rotate(${img.rotation ?? 0}deg) scaleX(${img.flippedX ? -1 : 1}) scaleY(${img.flippedY ? -1 : 1})`;
							return (
								<div key={idx} className="absolute rounded overflow-hidden" style={{ left: `${cell.x}%`, top: `${cell.y}%`, width: `${cell.width}%`, height: `${cell.height}%` }}>
									<img src={img.src} alt="" className="w-full h-full object-cover" style={{ filter: filterStr, transform: transformStr }} onClick={() => setEditingImageIdx(idx)} />
								</div>
							);
						})}

									{stickers.map((st, i) => {
										const rect = getCanvasRect();
										const left = rect ? (percentToPx(st.x ?? 0, rect.width)) : (st.x ?? 0);
										const top = rect ? (percentToPx(st.y ?? 0, rect.height)) : (st.y ?? 0);
										return (
											<DraggableAny
												key={st.id}
												position={{ x: left, y: top }}
												onDrag={(e: DraggableEvent, data: DraggableData) => handleStickerDrag(e, data, i)}
												onStop={(e: DraggableEvent, data: DraggableData) => handleStickerDragStop(e, data, i)}
												bounds="parent"
											>
												<div onClick={() => { setSelectedStickerId(st.id); setSelectedTextId(null); }} style={{ position: 'absolute', width: st.width, height: st.height, touchAction: 'none', transform: `rotate(${st.rotation ?? 0}deg)`, boxSizing: 'border-box' }}>
													<ResizableBox width={st.width ?? 60} height={st.height ?? 60} minConstraints={[20, 20]} onResizeStop={(e, data) => handleStickerResizeStop(e, i, { width: (data as any).size.width, height: (data as any).size.height })}>
														{st.animated ? <AnimatedSticker src={st.src} /> : <img src={st.src} alt="sticker" style={{ width: '100%', height: '100%' }} />}
													</ResizableBox>
													{selectedStickerId === st.id && (
														<>
															<div style={{ position: 'absolute', left: -4, top: -4, right: -4, bottom: -4, border: '2px dashed #3b82f6', pointerEvents: 'none' }} />
															<div onPointerDown={(e) => onRotatePointerDown(e, i, true)} style={{ position: 'absolute', right: -18, top: '50%', width: 14, height: 14, background: '#fff', border: '1px solid #ccc', borderRadius: 999, cursor: 'grab', transform: 'translateY(-50%)' }} title="Rotate" />
														</>
													)}
												</div>
											</DraggableAny>
										);
									})}

									{texts.map((t, i) => {
										const rect = getCanvasRect();
										const left = rect ? (percentToPx(t.x ?? 0, rect.width)) : (t.x ?? 0);
										const top = rect ? (percentToPx(t.y ?? 0, rect.height)) : (t.y ?? 0);
										return (
											<DraggableAny
												key={t.id}
												position={{ x: left, y: top }}
												onStop={(e: DraggableEvent, data: DraggableData) => handleTextDragStop(e, data, i)}
												onDrag={(e: DraggableEvent, data: DraggableData) => {
													const { x, y } = clampPositionToCanvas(data.x, data.y);
													const rect2 = getCanvasRect();
													if (!rect2) return;
													const nx = (x / rect2.width) * 100;
													const ny = (y / rect2.height) * 100;
													setTexts(ts => ts.map((it, ii) => ii === i ? { ...it, x: nx, y: ny } : it));
												}}
												bounds="parent"
											>
												<div onClick={() => { setSelectedTextId(t.id); setSelectedStickerId(null); }} style={{ position: 'absolute', fontSize: t.fontSize, color: t.color, fontFamily: t.fontFamily, touchAction: 'none', cursor: 'move', transform: `rotate(${t.rotation ?? 0}deg)` }}>{t.text}
													{selectedTextId === t.id && (
														<>
															<div style={{ position: 'absolute', left: -4, top: -4, right: -4, bottom: -4, border: '2px dashed #3b82f6', pointerEvents: 'none' }} />
															<div onPointerDown={(e) => onRotatePointerDown(e, i, false)} style={{ position: 'absolute', right: -18, top: '50%', width: 14, height: 14, background: '#fff', border: '1px solid #ccc', borderRadius: 999, cursor: 'grab', transform: 'translateY(-50%)' }} title="Rotate" />
														</>
													)}
												</div>
											</DraggableAny>
										);
									})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PhotoEditor;
