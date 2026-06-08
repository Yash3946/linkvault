import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/auth/logout-button";
import { createClient } from "@/lib/supabase/server";
import { addBookmark, deleteBookmark } from "./actions";

export const metadata = { title: "Dashboard | LinkVault" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("email, handle").eq("id", user.id).single();

  const { data: bookmarks } = await supabase
    .from("bookmarks").select("*").eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const totalCount = bookmarks?.length || 0;
  const publicCount = bookmarks?.filter((b) => b.is_public).length || 0;
  const privateCount = bookmarks?.filter((b) => !b.is_public).length || 0;

  return (
    <div
      className="min-h-screen"
      style={{ background: "#f5f1eb", fontFamily: "'Georgia', serif" }}
    >
      <div className="mx-auto max-w-3xl px-5 py-8">

        {/* Navbar */}
        <nav className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: "#1a2744" }}
            >
              <svg className="h-5 w-5" style={{ color: "#f5f1eb" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <span className="text-base font-medium tracking-wide" style={{ color: "#1a2744" }}>
              LinkVault
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="rounded-full px-3 py-1 text-sm font-medium"
              style={{ background: "#e8e3d9", border: "0.5px solid #c9c2b4", color: "#4a5568" }}
            >
              @{profile?.handle}
            </span>
            <LogoutButton />
          </div>
        </nav>

        {/* Hero */}
        <div className="mb-7">
          <p
            className="mb-2 text-xs uppercase tracking-widest"
            style={{ color: "#8a7d6b", letterSpacing: "0.12em" }}
          >
            Dashboard
          </p>
          <h1 className="text-3xl font-medium" style={{ color: "#1a2744" }}>
            Welcome back, {profile?.handle}
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#8a7d6b" }}>
            All your links, organised and ready.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-5 grid grid-cols-3 gap-3">
          <div
            className="rounded-2xl p-5"
            style={{ background: "#e0daf2", border: "0.5px solid #b9b0e5" }}
          >
            <p className="mb-2 text-xs uppercase tracking-wider font-medium" style={{ color: "#534AB7" }}>
              Total links
            </p>
            <p className="text-4xl font-medium" style={{ color: "#3C3489" }}>{totalCount}</p>
          </div>
          <div
            className="rounded-2xl p-5"
            style={{ background: "#ddf0e8", border: "0.5px solid #9fd8bf" }}
          >
            <p className="mb-2 text-xs uppercase tracking-wider font-medium" style={{ color: "#0F6E56" }}>
              Public
            </p>
            <p className="text-4xl font-medium" style={{ color: "#085041" }}>{publicCount}</p>
          </div>
          <div
            className="rounded-2xl p-5"
            style={{ background: "#dceaf8", border: "0.5px solid #9ec6ef" }}
          >
            <p className="mb-2 text-xs uppercase tracking-wider font-medium" style={{ color: "#185FA5" }}>
              Private
            </p>
            <p className="text-4xl font-medium" style={{ color: "#0C447C" }}>{privateCount}</p>
          </div>
        </div>

        {/* Profile Card */}
        <div
          className="mb-4 rounded-2xl p-6"
          style={{ background: "#fffef9", border: "0.5px solid #ddd7cc" }}
        >
          <h2 className="mb-4 flex items-center gap-2 text-base font-medium" style={{ color: "#1a2744" }}>
            <svg className="h-4 w-4" style={{ color: "#8a7d6b" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile
          </h2>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <p className="mb-1 text-xs uppercase tracking-wider" style={{ color: "#8a7d6b" }}>Email</p>
              <p className="text-sm" style={{ color: "#2d3748" }}>{profile?.email}</p>
            </div>
            <div>
              <p className="mb-1 text-xs uppercase tracking-wider" style={{ color: "#8a7d6b" }}>Public profile</p>
              <span
                className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
                style={{ background: "#e0daf2", border: "0.5px solid #b9b0e5", color: "#534AB7" }}
              >
                @{profile?.handle}
              </span>
            </div>
          </div>
          <div className="mt-5 pt-4" style={{ borderTop: "0.5px solid #eae5db" }}>
            <Link
              href={`/${profile?.handle}`}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors"
              style={{ background: "#f0eefb", border: "0.5px solid #c9c4ee", color: "#534AB7" }}
            >
              ↗ View your public profile
            </Link>
          </div>
        </div>

        {/* Add Bookmark */}
        <div
          className="mb-4 rounded-2xl p-6"
          style={{ background: "#fffef9", border: "0.5px solid #ddd7cc" }}
        >
          <h2 className="mb-4 flex items-center gap-2 text-base font-medium" style={{ color: "#1a2744" }}>
            <svg className="h-4 w-4" style={{ color: "#8a7d6b" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add bookmark
          </h2>
          <form action={addBookmark} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                name="title"
                placeholder="Title"
                required
                className="rounded-xl px-4 py-2.5 text-sm outline-none"
                style={{
                  background: "#f5f1eb",
                  border: "0.5px solid #ccc6ba",
                  color: "#1a2744",
                  fontFamily: "'Georgia', serif",
                }}
              />
              <input
                name="url"
                type="url"
                placeholder="https://example.com"
                required
                className="rounded-xl px-4 py-2.5 text-sm outline-none"
                style={{
                  background: "#f5f1eb",
                  border: "0.5px solid #ccc6ba",
                  color: "#1a2744",
                  fontFamily: "'Georgia', serif",
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-3 text-sm" style={{ color: "#6b6259" }}>
                <input type="checkbox" name="is_public" className="h-4 w-4" style={{ accentColor: "#534AB7" }} />
                Make public
              </label>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors"
                style={{ background: "#1a2744", color: "#f5f1eb" }}
              >
                + Save bookmark
              </button>
            </div>
          </form>
        </div>

        {/* Bookmarks List */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "#fffef9", border: "0.5px solid #ddd7cc" }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-medium" style={{ color: "#1a2744" }}>
              <svg className="h-4 w-4" style={{ color: "#8a7d6b" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              My bookmarks
            </h2>
            <span
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={{ background: "#ede8df", color: "#8a7d6b" }}
            >
              {totalCount} links
            </span>
          </div>

          {bookmarks?.length === 0 ? (
            <div
              className="rounded-xl p-10 text-center text-sm"
              style={{ border: "0.5px dashed #ccc6ba", color: "#b0a899" }}
            >
              No bookmarks yet. Add your first one above.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {bookmarks?.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="group flex items-center justify-between rounded-xl p-4 transition-all"
                  style={{
                    background: "#f9f7f3",
                    border: "0.5px solid #ddd7cc",
                  }}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
                      style={{ background: "#e0daf2" }}
                    >
                      <svg className="h-4 w-4" style={{ color: "#7F77DD" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium" style={{ color: "#1a2744" }}>
                        {bookmark.title}
                      </p>
                      <p className="truncate text-xs" style={{ color: "#b0a899" }}>
                        {bookmark.url}
                      </p>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-shrink-0 items-center gap-2">
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-medium"
                      style={
                        bookmark.is_public
                          ? { background: "#ddf0e8", border: "0.5px solid #9fd8bf", color: "#0F6E56" }
                          : { background: "#ede8df", border: "0.5px solid #ccc6ba", color: "#8a7d6b" }
                      }
                    >
                      {bookmark.is_public ? "Public" : "Private"}
                    </span>
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs transition-colors"
                      style={{ background: "#f0eefb", border: "0.5px solid #c9c4ee", color: "#534AB7" }}
                    >
                      Visit ↗
                    </a>
                    <form
                      action={async () => {
                        "use server";
                        await deleteBookmark(bookmark.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                        style={{ background: "#fdf0f0", border: "0.5px solid #f0c2c2", color: "#e24b4a" }}
                        aria-label="Delete bookmark"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm transition-colors" style={{ color: "#b0a899" }}>
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}
