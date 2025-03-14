import { useState } from "react";
import { Modal, Upload, message } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { InboxOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useApiMutation } from "@hooks";

const { Dragger } = Upload;

const CsvUploadModal = ({ isOpen, handleCancel }: any) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const { mutate:uploadFile } = useApiMutation({ url: "users/upload", method: "POST"});
  const { t } = useTranslation()
  const queryClient = useQueryClient();
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
    try {
        uploadFile(
            { data: fileList[0], isFile: true }, // `isFile: true` deb belgilash muhim
            {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["users"] });
                setFileList([]);
                handleCancel(); // Close modal
              },
              onError: (error) => {
                console.error("Upload failed:", error);
              },
            }
          );

      
      
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
