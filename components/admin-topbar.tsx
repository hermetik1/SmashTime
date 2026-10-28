import { Bell, Search } from "@/components/icons";

export function AdminTopbar({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="admin-topbar">
      <div><span className="admin-topbar-kicker">SmashTime Control</span><h1>{title}</h1><p>{subtitle}</p></div>
      <div className="admin-topbar-actions"><button aria-label="Suchen" className="icon-button"><Search size={19} /></button><button aria-label="Benachrichtigungen" className="icon-button notification-button"><Bell size={19} /><i /></button><span className="admin-topbar-avatar">MK</span></div>
    </header>
  );
}
