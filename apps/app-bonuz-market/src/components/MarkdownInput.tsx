import { useCallback, useState } from 'react';

import MDEditor from '@uiw/react-md-editor';

interface Props {
  label?: string;
  error: string | undefined;
  value?: string | undefined
  onChange?: (value: string | undefined) => void;
}

const MarkdownInput = ({ label, error, value, onChange, }: Props) => {
  const [markdown, setMarkdown] = useState<string | undefined>(value);

  return (
    <div className="container">
      {label && (
        <label className="mb-3 block text-black dark:text-white">{label}</label>
      )}

      <MDEditor
        value={markdown}
        onChange={(e) => {
          setMarkdown(e);
          if (onChange) onChange(e);
        }}
      />
      {/* <MDEditor.Markdown
      source={markdown}
      style={{ whiteSpace: 'pre-wrap' }}
    /> */}
      {error && <p className="text-meta-1 text-14 mt-2">{error}</p>}
    </div>
  );
};

export default MarkdownInput;
