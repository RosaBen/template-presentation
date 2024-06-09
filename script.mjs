const slidesData = [
    {
        title: 'Slide 1',
        contents: [
            { type: 'text', format: 'p', value: '' },
            { type: 'text', format: 'h1', value: '' },
            { type: 'text', format: 'h2', value: '' },
            { type: 'text', format: 'h3', value: '' },
            { type: 'text', format: 'h4', value: '' },
            { type: 'text', format: 'h5', value: '' },
            { type: 'text', format: 'h6', value: '' },
            { type: 'image', value: '' },
            { type: 'link', value: '' },
            { type: 'video', value: '' }
        ]
    },
    {
        title: 'Slide 2',
        contents: [
            { type: 'text', format: 'p', value: '' },
            { type: 'image', value: '' },
            { type: 'link', value: '' },
            { type: 'video', value: '' }
        ]
    },
    // Ajoutez autant de slides que nécessaire
];


let currentSlide = 0;
let currentContent = 0;

function createSlides() {
  const presentation = document.getElementById("presentation");
  slidesData.forEach((slide, index) => {
    const slideElement = document.createElement("div");
    slideElement.className = "slide";
    slideElement.style.transform = `translateX(${index * 100}%)`;

    const title = document.createElement("h1");
    title.innerText = slide.title;
    title.className = "movable";
    makeMovable(title);

    slide.contents.forEach((content, contentIndex) => {
      let contentElement;
      if (content.type === "text") {
        contentElement = document.createElement(content.format);
        contentElement.innerText = content.value;
      } else if (content.type === "image") {
        contentElement = document.createElement("img");
        contentElement.src = content.value;
      } else if (content.type === "link") {
        contentElement = document.createElement("a");
        contentElement.href = content.value;
        contentElement.target = "_blank";
        contentElement.innerText = "Ouvrir le lien";
      } else if (content.type === "video") {
        contentElement = document.createElement("a");
        contentElement.href = content.value;
        contentElement.target = "_blank";
        contentElement.innerText = "Ouvrir la vidéo";
      }
      contentElement.className = "movable content-" + index;
      contentElement.dataset.contentIndex = contentIndex;
      makeMovable(contentElement);
      slideElement.appendChild(contentElement);
    });

    presentation.appendChild(slideElement);
  });
}

function makeMovable(element) {
  element.onmousedown = function (event) {
    event.preventDefault();
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
      element.style.left = pageX - shiftX + "px";
      element.style.top = pageY - shiftY + "px";
    }

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }

    document.addEventListener("mousemove", onMouseMove);

    document.onmouseup = function () {
      document.removeEventListener("mousemove", onMouseMove);
      document.onmouseup = null;
    };
  };

  element.ondragstart = function () {
    return false;
  };
}

function navigateSlide(direction) {
  const slides = document.querySelectorAll(".slide");
  if (direction === 1 && currentSlide < slides.length - 1) {
    currentSlide++;
  } else if (direction === -1 && currentSlide > 0) {
    currentSlide--;
  }
  slides.forEach((slide, index) => {
    slide.style.transform = `translateX(${(index - currentSlide) * 100}%)`;
  });
}

function navigateContent(direction) {
  const currentSlideContents = document.querySelectorAll(
    ".content-" + currentSlide
  );
  if (direction === 1 && currentContent < currentSlideContents.length - 1) {
    currentContent++;
  } else if (direction === -1 && currentContent > 0) {
    currentContent--;
  }
  currentSlideContents.forEach((content, index) => {
    content.style.display = index === currentContent ? "block" : "none";
  });
}

function addContent() {
  const contentType = document.getElementById("content-type").value;
  const contentValue = document.getElementById("content-value").value;
  const textFormat = document.getElementById("text-format").value;

  if (!contentValue) return; // Ne rien faire si la valeur du contenu est vide

  let newContent;
  if (contentType === "text") {
    newContent = { type: contentType, format: textFormat, value: contentValue };
  } else {
    newContent = { type: contentType, value: contentValue };
  }
  slidesData[currentSlide].contents.push(newContent);

  const slideElement = document.querySelectorAll(".slide")[currentSlide];
  let contentElement;

  if (contentType === "text") {
    contentElement = document.createElement(textFormat);
    contentElement.innerText = contentValue;
  } else if (contentType === "image") {
    contentElement = document.createElement("img");
    contentElement.src = contentValue;
  } else if (contentType === "link") {
    contentElement = document.createElement("a");
    contentElement.href = contentValue;
    contentElement.target = "_blank";
    contentElement.innerText = "Ouvrir le lien";
  } else if (contentType === "video") {
    contentElement = document.createElement("a");
    contentElement.href = contentValue;
    contentElement.target = "_blank";
    contentElement.innerText = "Ouvrir la vidéo";
  }

  contentElement.className = "movable content-" + currentSlide;
  makeMovable(contentElement);
  slideElement.appendChild(contentElement);
}

function toggleForm() {
  const form = document.getElementById("add-content-form");
  if (form.style.display === "none" || form.style.display === "") {
    form.style.display = "block";
  } else {
    form.style.display = "none";
  }
}

document.getElementById("content-type").addEventListener("change", function () {
  const textFormat = document.getElementById("text-format");
  if (this.value === "text") {
    textFormat.style.display = "inline";
  } else {
    textFormat.style.display = "none";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  createSlides();
  navigateContent(0); // Afficher le premier contenu de la première slide
});
