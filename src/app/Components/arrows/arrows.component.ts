import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-arrows',
  templateUrl: './arrows.component.html',
  styleUrls: ['./arrows.component.scss']
})
export class ArrowsComponent implements OnInit{
  showScrollTopButton = false;
  showScrollBottomButton = false;

  ngOnInit(): void {
    this.updateScrollButtons();
    
    // Create a MutationObserver to observe changes in the document body
    // const observer = new MutationObserver(() => {
      // this.onDocumentHeightChange();
    // });

    // Start observing changes in the attributes and children of the document body
    // observer.observe(document.body, { attributes: true, childList: false, subtree: false });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.updateScrollButtons();
  }

  onDocumentHeightChange() {
    this.updateScrollButtons();
  }

  updateScrollButtons() {
    const scrollOffset = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.scrollHeight;

    this.showScrollTopButton = scrollOffset > 20;
    this.showScrollBottomButton = scrollOffset + windowHeight < documentHeight - 20 && documentHeight > windowHeight;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }
}
