'use client';

import { ComponentNode } from '@/types/project';
import { isValidEmail } from '@/lib/test';

interface RendererProps {
  node: ComponentNode;
  selectedId?: string;
  onSelect: (id: string) => void;
  onTextChange: (id: string, value: string) => void;
  emailValue: string;
  onEmailChange: (value: string) => void;
  onSubmit: () => void;
  submitted: boolean;
}

export function ComponentRenderer({
  node,
  selectedId,
  onSelect,
  onTextChange,
  emailValue,
  onEmailChange,
  onSubmit,
  submitted
}: RendererProps) {
  const selectedClass = selectedId === node.id ? 'ring-2 ring-blue-500 ring-offset-2 rounded-md' : '';
  const baseClass = node.props.styleClass ?? '';

  const wrapper = (child: React.ReactNode) => (
    <div className={selectedClass} onClick={(event) => {
      event.stopPropagation();
      onSelect(node.id);
    }}>
      {child}
    </div>
  );

  if (node.type === 'hero' || node.type === 'section') {
    return wrapper(
      <section className={baseClass}>{node.children?.map((child) => <ComponentRenderer key={child.id} node={child} selectedId={selectedId} onSelect={onSelect} onTextChange={onTextChange} emailValue={emailValue} onEmailChange={onEmailChange} onSubmit={onSubmit} submitted={submitted} />)}</section>
    );
  }

  if (node.type === 'headline') {
    return wrapper(
      <h1
        className={baseClass}
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onTextChange(node.id, e.currentTarget.textContent || '')}
      >
        {node.props.text}
      </h1>
    );
  }

  if (node.type === 'subtext') {
    return wrapper(
      <p
        className={baseClass}
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onTextChange(node.id, e.currentTarget.textContent || '')}
      >
        {node.props.text}
      </p>
    );
  }

  if (node.type === 'form') {
    return wrapper(
      <div className={baseClass}>{node.children?.map((child) => <ComponentRenderer key={child.id} node={child} selectedId={selectedId} onSelect={onSelect} onTextChange={onTextChange} emailValue={emailValue} onEmailChange={onEmailChange} onSubmit={onSubmit} submitted={submitted} />)}</div>
    );
  }

  if (node.type === 'input') {
    return wrapper(
      <input
        aria-label="email"
        className={baseClass}
        placeholder={node.props.placeholder}
        value={emailValue}
        onChange={(e) => onEmailChange(e.target.value)}
      />
    );
  }

  if (node.type === 'button') {
    const disabled = !isValidEmail(emailValue);
    return wrapper(
      <button className={baseClass} type="button" onClick={onSubmit} disabled={disabled}>
        {submitted ? node.props.submittedText : node.props.text}
      </button>
    );
  }

  if (node.type === 'image') {
    return wrapper(
      // eslint-disable-next-line @next/next/no-img-element
      <img className={baseClass} src={node.props.src} alt={node.props.alt || ''} />
    );
  }

  return null;
}
