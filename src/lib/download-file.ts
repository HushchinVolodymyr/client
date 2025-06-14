import { RootState, store } from "@/store/store";
import { toast } from "sonner";

export const handleDownload = async (filePath: string, fileName: string) => {
    const state: RootState = store.getState();
    const token = state.user.token;

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/FileDownload/download${filePath}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Download failed: ${response.statusText}`);
        }

        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
    } catch (error: any) {
        toast.error("Error downloading file", error);
    }
};