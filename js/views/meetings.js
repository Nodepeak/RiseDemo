const meetingIsUpcoming = ({ date }) => date >= demoTodayIso;

function meetingsForProject(projectId, upcoming) {
  return meetings
    .filter((meeting) => meeting.project === projectId && meetingIsUpcoming(meeting) === upcoming)
    .sort((first, second) => {
      const order = first.date.localeCompare(second.date) || first.time.localeCompare(second.time);
      return (upcoming ? order : -order) || first.id.localeCompare(second.id);
    });
}

function renderMeetings(project) {
  return `<section class="page meetings-page">
    ${renderProjectHeader(project, "Vergaderingen", "Bekijk de agenda van komende overleggen of open een verslag met de bijbehorende actiepunten.")}
    ${renderMeetingGroup(project, true)}
    ${renderMeetingGroup(project, false)}
  </section>`;
}

function renderMeetingGroup(project, upcoming) {
  const group = meetingsForProject(project.id, upcoming);
  const id = upcoming ? "upcoming-meetings" : "past-meetings";
  return `<section class="meeting-group" aria-labelledby="${id}">
    <header class="section-header"><h2 id="${id}">${upcoming ? "Komende vergaderingen" : "Geweest"}</h2><span class="group-count">${group.length}</span></header>
    ${group.length ? `<div class="meeting-rows">${group.map(renderMeetingRow).join("")}</div>` : `<p class="empty">${upcoming ? "Er staan geen vergaderingen gepland." : "Er zijn nog geen vergaderingen met een verslag."}</p>`}
  </section>`;
}

function renderMeetingRow(meeting) {
  const upcoming = meetingIsUpcoming(meeting);
  const expanded = state.selMeeting[meeting.project] === meeting.id;
  const adopted = state.agendaAdopted[meeting.id];
  const label = upcoming ? adopted ? "Concept-agenda" : "Agendavoorstel" : "Notulen en acties";
  return `<article class="meeting-row" id="${meeting.id}">
    <h3><button class="meeting-trigger" id="meeting-toggle-${meeting.id}" data-action="select-meeting" data-id="${meeting.id}" aria-expanded="${expanded}" aria-controls="meeting-detail-${meeting.id}">
      <time class="meeting-date" datetime="${meeting.date}T${meeting.time}"><b>${formatIsoDate(meeting.date)}</b><small>${meeting.time}</small></time>
      <span class="meeting-name"><b>${escapeHtml(meeting.title)}</b><small>${escapeHtml(meeting.place)}</small></span>
      <span class="meeting-label">${label}</span>
      ${icon("chev")}
    </button></h3>
    <div id="meeting-detail-${meeting.id}"${expanded ? "" : " hidden"}>
      ${expanded ? `<div class="meeting-details">
        <p class="meeting-people"><strong>Deelnemers</strong> ${meeting.people.map(escapeHtml).join(", ")}</p>
        ${upcoming ? renderMeetingAgenda(meeting, adopted) : renderMeetingMinutes(meeting)}
        ${renderMeetingActions(meeting)}
      </div>` : ""}
    </div>
  </article>`;
}

function renderMeetingAgenda(meeting, adopted) {
  return `<section class="meeting-content m-agenda">
    <h4>${adopted ? "Concept-agenda" : "Voorgestelde agenda"}</h4>
    <ol>${(meeting.proposal ?? []).map(([title, description, source]) => `<li>
      <b>${escapeHtml(title)}</b><div>${escapeHtml(description)} ${source.startsWith("s-")
        ? `<button class="claim-src" data-action="open-signal" data-id="${source}">Bekijk signaal</button>`
        : `<a class="claim-src" href="${sourceHref(source)}" data-action="open-doc" data-doc="${source}">Bekijk bron</a>`}</div>
    </li>`).join("")}</ol>
    <div class="m-agenda-act">
      ${adopted ? "" : `<button class="btn btn--rise btn--sm" data-action="adopt-agenda" data-id="${meeting.id}">Neem over als agenda</button>`}
      <button class="btn btn--ghost btn--sm" data-action="meeting-prep" data-id="${meeting.id}">${pipIcon()}Werk uit met Pip</button>
    </div>
  </section>`;
}

function renderMeetingMinutes(meeting) {
  return `<section class="meeting-content">
    <h4>Notulen</h4>
    ${meeting.doc ? `<p>${escapeHtml(documents[meeting.doc].summary)}</p>` : '<p class="muted">Geen verslag toegevoegd.</p>'}
    ${meeting.decisions.length ? `<h5>Besluiten</h5><ul class="bullets">${meeting.decisions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}
    ${meeting.doc ? renderSource(meeting.doc) : ""}
  </section>`;
}

function renderMeetingActions(meeting) {
  const byId = new Map(projectActions(meeting.project).map((action) => [action.id, action]));
  const actionRows = meeting.actions.map(([, title]) => byId.get(meetingActionId(meeting.project, title)));
  return `<section class="meeting-content">
    <h4>${meetingIsUpcoming(meeting) ? "Actiepunten ter voorbereiding" : "Actiepunten"}</h4>
    ${actionRows.length ? `<ul class="meeting-actions">${actionRows.map(({ title, owner, deadline, status }) => `<li>
      <div><b>${escapeHtml(title)}</b><small>${escapeHtml(owner)}</small></div>
      <div><small>Deadline</small>${renderDueDate(deadline)}</div>
      ${renderActionStatus(status)}
    </li>`).join("")}</ul>` : '<p class="muted">Geen actiepunten vastgelegd.</p>'}
  </section>`;
}

function meetingNotesReply(meeting) {
  const actions = projectActions(meeting.project).filter((action) => action.meeting?.id === meeting.id);
  return {
    title: `Notulen van ${meeting.title}`,
    blocks: [
      {
        type: "text",
        html: `<p>${escapeHtml(documents[meeting.doc].summary)}</p><p><strong>Besluiten</strong></p><ul>${meeting.decisions.map((decision) => `<li>${escapeHtml(decision)}</li>`).join("")}</ul>`,
      },
      {
        type: "table",
        head: ["Actie", "Eigenaar", "Deadline", "Status"],
        rows: actions.map(({ title, owner, deadline, status }) =>
          [title, owner, deadline ? formatIsoDate(deadline) : "Geen deadline", status].map(escapeHtml),
        ),
      },
      { type: "sources", items: [[meeting.doc, null]] },
      { type: "actions", items: [{
        label: "Open vergadering",
        go: { view: "project", projectId: meeting.project, section: "vergaderingen", meetingId: meeting.id },
      }] },
    ],
  };
}
