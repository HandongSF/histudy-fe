import { EditorContent, useEditor, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Highlighter,
    Code,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Quote,
    List,
    ListOrdered,
    Undo,
    Redo,
    AlignLeft,
    AlignCenter,
    AlignJustify,
    AlignRight,
    Link as LinkIcon,
    Unlink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TiptapEditorProps {
    content: string;
    onUpdate: (html: string) => void;
}

// 에디터 툴바 컴포넌트
const MenuBar = ({ editor }: { editor: Editor }) => {
    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-1 border-b p-2">
            {/* 텍스트 서식 버튼 그룹 */}
            <div className="flex items-center gap-1">
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={editor.isActive("bold") ? "bg-accent" : ""}
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={editor.isActive("italic") ? "bg-accent" : ""}
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    disabled={!editor.can().chain().focus().toggleUnderline().run()}
                    className={editor.isActive("underline") ? "bg-accent" : ""}
                >
                    <UnderlineIcon className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={!editor.can().chain().focus().toggleStrike().run()}
                    className={editor.isActive("strike") ? "bg-accent" : ""}
                >
                    <Strikethrough className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                    disabled={!editor.can().chain().focus().toggleHighlight().run()}
                    className={editor.isActive("highlight") ? "bg-accent" : ""}
                >
                    <Highlighter className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
                    className={editor.isActive("codeBlock") ? "bg-accent" : ""}
                >
                    <Code className="h-4 w-4" />
                </Button>
            </div>

            {/* 제목 및 목록 버튼 그룹 */}
            <div className="flex items-center gap-1">
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive("heading", { level: 1 }) ? "bg-accent" : ""}
                >
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive("heading", { level: 2 }) ? "bg-accent" : ""}
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor.isActive("heading", { level: 3 }) ? "bg-accent" : ""}
                >
                    <Heading3 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                    className={editor.isActive("heading", { level: 4 }) ? "bg-accent" : ""}
                >
                    <Heading4 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={editor.isActive("blockquote") ? "bg-accent" : ""}
                >
                    <Quote className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive("bulletList") ? "bg-accent" : ""}
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive("orderedList") ? "bg-accent" : ""}
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
            </div>

            {/* 첨자 및 링크 버튼 그룹 */}
            <div className="flex items-center gap-1">
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => editor.chain().focus().toggleSuperscript().run()}
                    className={editor.isActive("superscript") ? "bg-accent" : ""}
                >
                    <span className="text-xs">sup</span>
                </Button>
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => editor.chain().focus().toggleSubscript().run()}
                    className={editor.isActive("subscript") ? "bg-accent" : ""}
                >
                    <span className="text-xs">sub</span>
                </Button>
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                        const previousUrl = editor.getAttributes("link").href;
                        const url = window.prompt("URL", previousUrl);

                        if (url === null) {
                            return;
                        }

                        if (url === "") {
                            editor.chain().focus().extendMarkRange("link").unsetLink().run();
                            return;
                        }

                        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
                    }}
                    className={editor.isActive("link") ? "bg-accent" : ""}
                >
                    <LinkIcon className="h-4 w-4" />
                </Button>
                <Button type="button" size="icon" variant="ghost" onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive("link")}>
                    <Unlink className="h-4 w-4" />
                </Button>
            </div>

            {/* 정렬 및 실행 취소/다시 실행 버튼 그룹 */}
            <div className="flex items-center gap-1">
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => editor.chain().focus().setTextAlign("left").run()}
                    className={editor.isActive({ textAlign: "left" }) ? "bg-accent" : ""}
                >
                    <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => editor.chain().focus().setTextAlign("center").run()}
                    className={editor.isActive({ textAlign: "center" }) ? "bg-accent" : ""}
                >
                    <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => editor.chain().focus().setTextAlign("right").run()}
                    className={editor.isActive({ textAlign: "right" }) ? "bg-accent" : ""}
                >
                    <AlignRight className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                    className={editor.isActive({ textAlign: "justify" }) ? "bg-accent" : ""}
                >
                    <AlignJustify className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

// 메인 에디터 컴포넌트
export function TiptapEditor({ content, onUpdate }: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Superscript,
            SubScript,
            Highlight,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Link.configure({
                openOnClick: false,
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onUpdate(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose dark:prose-invert max-h-[400px] overflow-y-auto px-3 py-2 min-h-[200px] !outline-none !ring-0 !ring-offset-0",
                style: "--ring: transparent; --border: transparent;", // 여기서 CSS 변수를 직접 설정합니다.
            },
        },
    });

    return (
        <div className="tiptap-editor border rounded-md">
            <MenuBar editor={editor} />
            <EditorContent
                editor={editor}
                className="prose dark:prose-invert max-h-[400px] overflow-y-auto px-3 py-2 min-h-[200px]"
                style={{ outline: "none", boxShadow: "none", border: "none" }} // 인라인 스타일로 직접 적용
            />
        </div>
    );
}
