			function h(C, B, A, F) {
				var E = "Cwm fjordbank glyphs vext quiz",
					D = C.getContext("2d");
				D.font = B;
				if (typeof(D.fillText) == "function") {
					D.fillText(E, A || 2, F || 2);
				} else {
					if (typeof(D.fillRect) == "function") {
						D.fillRect(100, 5, 30, 15);
					}
				}
			}

			function f() {
				if (!window.HTMLCanvasElement) {
					return 0;
				}
				try {
					var D = "",
						A = document.createElement("canvas"),
						B = A.getContext("2d");
					A.style.display = "none";
					B.textBaseline = "top";
					B.textBaseline = "alphabetic";
					B.fillStyle = "#f60";
					B.fillRect(125, 1, 62, 20);
					B.fillStyle = "#069";
					h(A, "11pt no-real-font-" + (Math.floor(Math.random * 1000)), 2, 15);
					B.fillStyle = "rgba(102, 204, 0, 0.7)";
					h(A, "18pt Arial", 4, 17);
					try {
						document.body.appendChild(A);
					} catch (C) {}
					D = A.toDataURL ? A.toDataURL() : "xxx";
					try {
						B.globalCompositeOperation = "screen";
						D += (B.globalCompositeOperation === "screen") ? "gco" : "000";
					} catch (C) {
						D += "grr";
					}
					try {
						B.clearRect(0, 0, 30, 30);
						B.rect(0, 0, 10, 10);
						B.rect(2, 2, 6, 6);
						D += (B.isPointInPath(5, 5, "evenodd") === false) ? "ppn" : "ppy";
					} catch (C) {
						D += "prr";
					}
					try {
						B.clearRect(0, 0, 30, 30);
						B.textBaseline = "top";
						B.font = "32px Arial";
						B.fillText("\ud83d\ude03", 0, 0);
						D += (B.getImageData(16, 16, 1, 1).data[0] !== 0) ? "emo" : "eno";
					} catch (C) {
						D += "irr";
					}
				} catch (C) {
					return D + "1";
				} finally {
					try {
						A.parentNode.removeChild(A);
					} catch (C) {} finally {
						return D;
					}
				}
			}