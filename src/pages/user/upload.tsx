import { useState } from "react";
import { Modal, Upload, Button, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import axios from "axios";

const { Dragger } = Upload;

const CsvUploadModal = ({ isOpen, handleCancel }: any) => {
  const [fileList, setFileList] = useState<any[]>([]);

  const { t } = useTranslation()
  const beforeUpload = (file: File) => {
    const isCsv = file.type === "text/csv";

    if (!isCsv) {
      message.error("Only .csv files are allowed!");
      return false;
    }

    setFileList([file]); // Accept only one file
    return false; // Prevent auto upload
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileList[0]);

    try {
      const response = await axios.post("/api/users/upload-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success("File uploaded successfully!");
      setFileList([]);
      handleCancel(); // Close modal
    } catch (error) {
      message.error("File upload failed!");
      console.error("Upload failed:", error);
    }
  };

  return (
    <Modal
      title={t('upload_scv_file')}
      open={isOpen}
      onCancel={handleCancel}
      onOk={handleUpload}
      okText={t('upload')}
      cancelText={t('cancel')}
    >
      <Dragger
        multiple={false}
        beforeUpload={beforeUpload}
        fileList={fileList}
        onRemove={() => setFileList([])}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">{t('drag_drop')}</p>
        <p className="ant-upload-hint">{t('warning_file_upload')}</p>
      </Dragger>
    </Modal>
  );
};

export default CsvUploadModal;
