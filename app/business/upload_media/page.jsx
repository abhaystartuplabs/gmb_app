"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function CheckImagePage() {
    const [url, setUrl] = useState("");
    const [preview, setPreview] = useState(null);
    const [isValid16by9, setIsValid16by9] = useState(false);
    const [mediaType, setMediaType] = useState("PHOTO");
    const [loading, setLoading] = useState(false);
    const [selectedLocationId, setSelectedLocationId] = useState("");
    const [error, setError] = useState("");
    const { data: session, status } = useSession();
    const [accountId, setAccountId] = useState("");
    const [successMsg, setSuccessMsg] = useState(null);
    const imgRef = useRef(null);

    const searchParams = useSearchParams();

    /** Fetch accountId from URL */
    useEffect(() => {
        const acc = searchParams.get("accountId");
        if (acc) setAccountId(acc);
    }, [searchParams]);


    /** Load image or video */
    const loadImage = () => {
        if (!url.trim()) return alert("Enter a valid public URL");
        setPreview(url);
    };

    /** Validate Image Aspect Ratio */
    const onImageLoad = () => {
        if (mediaType === "VIDEO") {
            setIsValid16by9(true);
            return;
        }

        const img = imgRef.current;
        const w = img.naturalWidth;
        const h = img.naturalHeight;

        const ratio = w / h;
        const maxRatio = 16 / 9;

        // console.log("ratio:-",ratio)

        if (ratio <= maxRatio) {
            setIsValid16by9(true);
            alert(`Valid 16:9\n${w}×${h}\nRatio: ${ratio.toFixed(2)} (≤ 1.78)`);
        } else {
            setIsValid16by9(false);
            alert(
                `Invalid Aspect Ratio.\nYour ratio: ${ratio.toFixed(
                    2
                )}\nMax allowed: 1.78 (16:9)`
            );
        }
    };

    /** Fetch locations */
    useEffect(() => {
        const fetchLocations = async () => {
            if (status !== "authenticated" || !session?.accessToken) return;
            setLoading(true);
            setError("");

            try {
                const res = await fetch("/api/business/locations");
                const data = await res.json();

                if (!res.ok || data.error) throw data.error;

                if (data.locations?.length > 0) {
                    setSelectedLocationId(data.locations[0].name.split("/").pop());
                }
            } catch (err) {
                setError(String(err));
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, [session, status]);

    /** Upload To GMB */
    const publishToGMB = async () => {
        if (!isValid16by9)
            return alert("Image/video is not valid for upload.");

        const payload = {
            imageUrl: url,
            mediaFormat: mediaType,
            accountId,
            locationId: selectedLocationId,
            accessToken: session?.accessToken,
        };

        const res = await fetch("/api/business/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const json = await res.json();

        setSuccessMsg(json);

        setTimeout(() => {
            setSuccessMsg(null);
        }, 2000);
    };


    return (
        <div style={{
            background: "#f3f4f6",
            minHeight: "100vh",
            padding: "40px",
            display: "flex",
            justifyContent: "center",
        }}>
            <div style={{
                background: "white",
                width: "100%",
                maxWidth: "600px",
                borderRadius: "15px",
                padding: "30px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            }}>
                <h1 style={{
                    textAlign: "center",
                    fontSize: "24px",
                    fontWeight: "700",
                    marginBottom: "25px",
                    color: "#111827",
                }}>
                    Google My Business – Media Upload
                </h1>

                {/* Success Message */}
                {successMsg && (
                    <div style={{
                        background: "#e0ffe3",
                        border: "1px solid #4ade80",
                        padding: "12px 15px",
                        borderRadius: "8px",
                        color: "#166534",
                        fontWeight: "600",
                        marginBottom: "20px",
                        textAlign: "center",
                    }}>
                        🎉 Uploaded Successfully!
                    </div>
                )}

                {/* Media Type Selection */}
                <div style={{ marginBottom: 20, display: "flex", gap: "20px" }}>
                    <label>
                        <input
                            type="radio"
                            name="mediaType"
                            value="PHOTO"
                            checked={mediaType === "PHOTO"}
                            onChange={() => setMediaType("PHOTO")}
                        /> Photo
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="mediaType"
                            value="VIDEO"
                            checked={mediaType === "VIDEO"}
                            onChange={() => setMediaType("VIDEO")}
                        /> Video
                    </label>
                </div>

                {/* URL Input */}
                <input
                    style={{
                        width: "100%",
                        padding: 12,
                        border: "1px solid #d1d5db",
                        borderRadius: 8,
                        marginBottom: 15,
                    }}
                    placeholder="Paste public URL of Image or Video"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />

                {/* Load Button */}
                <button
                    onClick={loadImage}
                    style={{
                        width: "100%",
                        padding: 12,
                        background: "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: 8,
                        fontWeight: "600",
                        marginBottom: 25,
                        cursor: "pointer",
                    }}
                >
                    Load & Validate
                </button>


                {/* Preview Section */}
                {preview && (
                    <div style={{ marginTop: 20 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>
                            Preview
                        </h3>

                        {mediaType === "PHOTO" ? (
                            <img
                                ref={imgRef}
                                src={preview}
                                onLoad={onImageLoad}
                                style={{ width: "100%", borderRadius: 10 }}
                            />
                        ) : (
                            <video
                                src={preview}
                                controls
                                style={{ width: "100%", borderRadius: 10 }}
                                onLoadedMetadata={onImageLoad}
                            />
                        )}

                        {isValid16by9 && (
                            <button
                                onClick={publishToGMB}
                                style={{
                                    marginTop: 20,
                                    width: "100%",
                                    padding: 12,
                                    background: "green",
                                    color: "white",
                                    borderRadius: 8,
                                    border: "none",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                }}
                            >
                                Publish to Google My Business
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
