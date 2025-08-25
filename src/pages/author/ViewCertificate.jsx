import React, { useEffect, useState } from "react";
import { getCertificatesByPaperId } from "../../services/CertificateService";
import { useParams } from "react-router-dom";

const ViewCertificate = () => {
  const [certificateUrl, setCertificateUrl] = useState(null);
  const { paperId } = useParams();

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await getCertificatesByPaperId(paperId);
        // console.log("📦 Raw response:", response);

        if (Array.isArray(response) && response.length > 0) {
          const cert = response[0];
          // console.log("📦 Extracted certificate:", cert);

          if (cert?.certificateUrl) {
            setCertificateUrl(cert.certificateUrl);
          }
        } else {
          console.warn("⚠️ No certificate returned.");
        }
      } catch (error) {
        console.error("❌ Error fetching certificate:", error);
      }
    };

    fetchCertificate();
  }, [paperId]);

  return (
    <div style={{
      padding: 24,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      textAlign: "center"
    }}>
      {certificateUrl ? (
        <div>
          <img
            src={certificateUrl}
            alt="Certificate"
            style={{ maxWidth: "100%", height: "auto" }}
          />
          <p>
            🔗 URL: <a href={certificateUrl} target="_blank" rel="noopener noreferrer">{certificateUrl}</a>
          </p>
        </div>
      ) : (
        <p>⚠️ Certificate is not available or does not exist.</p>
      )}
    </div>
  );
};

export default ViewCertificate;
