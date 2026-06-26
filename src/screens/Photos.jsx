import { useEffect, useRef, useState } from "react";
import ScreenHeader from "../components/ScreenHeader";
import EmptyState from "../components/EmptyState";
import { CameraIcon, CompareIcon, PhotosIcon } from "../components/icons";
import { useAuth } from "../lib/AuthContext";
import { todayStr } from "../lib/dateUtils";
import { fetchPhotos, uploadPhoto, getSignedUrls } from "../lib/photos";

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function Photos() {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [urls, setUrls] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [compareMode, setCompareMode] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await fetchPhotos(user.id);
      setPhotos(data);
      if (data.length > 0) {
        const map = await getSignedUrls(data.map((p) => p.storage_path));
        setUrls(map);
        setSelectedId(data[data.length - 1].id);
      }
      setLoading(false);
    })();
  }, [user.id]);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const date = todayStr();
      const saved = await uploadPhoto({ userId: user.id, date, file });
      const newUrls = await getSignedUrls([saved.storage_path]);
      setUrls((u) => ({ ...u, ...newUrls }));
      setPhotos((prev) => {
        const without = prev.filter((p) => p.date !== date);
        return [...without, saved].sort((a, b) => (a.date < b.date ? -1 : 1));
      });
      setSelectedId(saved.id);
    } catch {
      setError("Couldn't upload photo — try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  if (loading) {
    return (
      <>
        <ScreenHeader title="Photos" subtitle="Visual progress over time." />
        <div className="flex justify-center py-10">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" />
        </div>
      </>
    );
  }

  const selected = photos.find((p) => p.id === selectedId) ?? photos[photos.length - 1];
  const earliest = photos[0];
  const latest = photos[photos.length - 1];

  return (
    <>
      <ScreenHeader title="Photos" subtitle="Visual progress over time." />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-btn bg-accent py-3.5 text-[15px] font-medium text-[#0d0d12] transition duration-200 hover:bg-accent-hover active:scale-[0.98] disabled:opacity-50"
      >
        <CameraIcon width={18} height={18} />
        {uploading ? "Uploading…" : "Add Today's Photo"}
      </button>

      {error && <p className="mb-3 text-[13px] text-[#ff6b6b]">{error}</p>}

      {photos.length === 0 ? (
        <EmptyState
          icon={<PhotosIcon width={22} height={22} />}
          title="No progress photos"
          message="Capture a photo to start building your visual timeline."
        />
      ) : (
        <>
          {!compareMode && selected && (
            <div key={selected.id} className="card-shadow fade-in mb-3 overflow-hidden rounded-card border border-border bg-surface">
              <img
                src={urls[selected.storage_path]}
                alt={`Progress photo from ${selected.date}`}
                className="aspect-[3/4] w-full object-cover"
              />
              <p className="px-4 py-3 text-center font-mono text-[12px] text-muted">
                {formatDate(selected.date)}
              </p>
            </div>
          )}

          {compareMode && earliest && latest && (
            <div className="mb-3 grid grid-cols-2 gap-2">
              {[earliest, latest].map((p, i) => (
                <div key={p.id} className="card-shadow overflow-hidden rounded-card border border-border bg-surface">
                  <img
                    src={urls[p.storage_path]}
                    alt={`Progress photo from ${p.date}`}
                    className="aspect-[3/4] w-full object-cover"
                  />
                  <p className="px-2 py-2 text-center font-mono text-[11px] text-muted">
                    {i === 0 ? "First" : "Latest"} · {formatDate(p.date)}
                  </p>
                </div>
              ))}
            </div>
          )}

          {photos.length > 1 && (
            <button
              type="button"
              onClick={() => setCompareMode((v) => !v)}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-btn border border-border py-2.5 text-[13px] font-medium text-accent transition duration-200 hover:bg-white/[0.03] active:scale-[0.99]"
            >
              <CompareIcon width={15} height={15} />
              {compareMode ? "Back to gallery" : "Compare first vs latest"}
            </button>
          )}

          {!compareMode && (
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2" style={{ scrollSnapType: "x proximity" }}>
              {photos.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedId(p.id)}
                  className="shrink-0 overflow-hidden rounded-btn border-2 transition duration-200 active:scale-95"
                  style={{
                    borderColor: p.id === selectedId ? "#5ab4ff" : "rgba(255,255,255,0.07)",
                    scrollSnapAlign: "start",
                  }}
                >
                  <img
                    src={urls[p.storage_path]}
                    alt={`Thumbnail from ${p.date}`}
                    className="h-24 w-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
