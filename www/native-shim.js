(function () {
  var cap = window.Capacitor;
  if (!cap || !cap.isNativePlatform || !cap.isNativePlatform()) return;
  var FS = cap.Plugins.Filesystem, Share = cap.Plugins.Share;

  async function saveAndShare(filename, base64) {
    var r = await FS.writeFile({ path: filename, data: base64, directory: 'CACHE' });
    await Share.share({ title: filename, files: [r.uri], dialogTitle: 'Save or send ' + filename });
  }

  window.exportToTXT = async function () {
    if (guests.length === 0) { alert("No guests in the database to export."); return; }
    var t = "WEDDING GUEST LIST\n==================\n\n";
    guests.forEach(function (g, i) {
      t += "Guest #" + (i + 1) + "\nName    : " + g.name + "\nMobile  : " + g.mobile +
           "\nAddress : " + g.address + "\n--------------------------------------\n\n";
    });
    await saveAndShare('Wedding_Guest_List.txt', btoa(unescape(encodeURIComponent(t))));
  };

  window.exportToPDF = async function () {
    if (guests.length === 0) { alert("No guests in the database to export."); return; }
    var doc = new window.jspdf.jsPDF();
    doc.setFontSize(18); doc.text("Wedding Guest List", 14, 22);
    doc.autoTable({
      startY: 30,
      head: [['#', 'Name', 'Mobile Number', 'Address']],
      body: guests.map(function (g, i) { return [i + 1, g.name, g.mobile, g.address]; }),
      theme: 'grid', headStyles: { fillColor: [126, 34, 206] },
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 40 }, 2: { cellWidth: 35 }, 3: { cellWidth: 'auto' } }
    });
    await saveAndShare('Wedding_Guest_List.pdf', doc.output('datauristring').split(',')[1]);
  };
})();
