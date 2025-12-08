import { useAppStore } from '../../stores/useAppStore';
import './IslamicFrame.css';

export function IslamicFrame() {
  const { frame } = useAppStore();

  if (frame === 'none') return null;

  return (
    <div className={`islamic-frame frame-${frame}`}>
      {/* Corner Decorations */}
      <div className="frame-corner top-right" />
      <div className="frame-corner top-left" />
      <div className="frame-corner bottom-right" />
      <div className="frame-corner bottom-left" />
      
      {/* Border Lines */}
      <div className="frame-border top" />
      <div className="frame-border bottom" />
      <div className="frame-border right" />
      <div className="frame-border left" />
      
      {/* Center Decorations */}
      <div className="frame-center top" />
      <div className="frame-center bottom" />
    </div>
  );
}
