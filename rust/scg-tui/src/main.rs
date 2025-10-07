use anyhow::Result;
use crossterm::{
    event::{self, Event, KeyCode, KeyEvent, KeyEventKind},
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use ratatui::{
    backend::CrosstermBackend,
    layout::{Constraint, Direction, Layout},
    widgets::{Block, Borders, List, ListItem, Paragraph, Wrap},
    Terminal,
};
use scg_core::{Atom, Grammar, SearchSpace, Triple, TripleIndex};
use std::io;

mod toy_grammar;
use toy_grammar::create_toy_grammar;

struct App {
    input: String,
    grammar: Grammar,
    search_space: Option<SearchSpace>,
    status: String,
    nodes_summary: Vec<String>,
    partials_summary: Vec<String>,
    extracted_summary: Vec<String>,
}

impl App {
    fn new() -> Self {
        Self {
            input: String::new(),
            grammar: create_toy_grammar(),
            search_space: None,
            status: "Type a sentence and press Enter to parse".to_string(),
            nodes_summary: Vec::new(),
            partials_summary: Vec::new(),
            extracted_summary: Vec::new(),
        }
    }

    fn parse(&mut self) {
        let tokens: Vec<&str> = self.input.split_whitespace().collect();

        if tokens.is_empty() {
            self.status = "No input to parse".to_string();
            return;
        }

        let mut input_triples = Vec::new();
        for (idx, &token) in tokens.iter().enumerate() {
            let entity_id = (idx + 1) * 100;
            let word_const = match token {
                "the" => 1001,
                "a" => 1002,
                "cat" => 2001,
                "dog" => 2002,
                _ => 9999,
            };

            input_triples.push(Triple::new(
                Atom::Const(entity_id),
                0,
                Atom::Const(word_const),
            ));
        }

        let input_index = TripleIndex::from_vec(input_triples);

        let mut search_space = SearchSpace::new(self.grammar.clone());
        search_space.add_init_nodes(input_index);

        let mut ticks = 0;
        let max_ticks = 100;

        loop {
            if ticks >= max_ticks {
                break;
            }

            let cxn_ids: Vec<_> = self.grammar.cxns.keys().copied().collect();
            let mut progress = false;

            for cxn_id in cxn_ids {
                if search_space.tick(cxn_id) {
                    progress = true;
                }
            }

            if !progress {
                break;
            }

            ticks += 1;
        }

        self.nodes_summary.clear();
        for (node_id, node) in &search_space.nodes {
            self.nodes_summary.push(format!(
                "Node {}: cxn={}, valid={}, {} merge triples",
                node_id,
                node.cxn_id,
                node.binding.valid,
                node.merging.len()
            ));
        }

        self.partials_summary.clear();
        for (partial_id, partial) in &search_space.partials {
            self.partials_summary.push(format!(
                "Partial {}: cxn={}, node={}, valid={}",
                partial_id, partial.cxn_id, partial.parent_node, partial.binding.valid
            ));
        }

        let results = search_space.generate_parsing_results();
        self.extracted_summary.clear();

        for (idx, (node_ids, triples, binding)) in results.iter().enumerate() {
            self.extracted_summary.push(format!(
                "Result {}: {} nodes, {} triples, valid={}",
                idx,
                node_ids.len(),
                triples.len(),
                binding.valid
            ));

            for triple in triples.iter().take(5) {
                self.extracted_summary.push(format!("  {}", triple));
            }
        }

        self.search_space = Some(search_space);
        self.status = format!(
            "Parsed {} tokens, {} nodes, {} partials, {} results",
            tokens.len(),
            self.nodes_summary.len(),
            self.partials_summary.len(),
            results.len()
        );
    }

    fn handle_key(&mut self, key: KeyEvent) -> bool {
        if key.code == KeyCode::Char('q') && key.modifiers.contains(event::KeyModifiers::CONTROL) {
            return true;
        }

        match key.code {
            KeyCode::Char(c) => {
                self.input.push(c);
            }
            KeyCode::Backspace => {
                self.input.pop();
            }
            KeyCode::Enter => {
                self.parse();
            }
            _ => {}
        }
        false
    }
}

fn main() -> Result<()> {
    enable_raw_mode()?;
    let mut stdout = io::stdout();
    execute!(stdout, EnterAlternateScreen)?;
    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend)?;

    let mut app = App::new();
    let result = run_app(&mut terminal, &mut app);

    disable_raw_mode()?;
    execute!(terminal.backend_mut(), LeaveAlternateScreen)?;
    terminal.show_cursor()?;

    if let Err(err) = result {
        println!("Error: {:?}", err);
    }

    Ok(())
}

fn run_app<B: ratatui::backend::Backend>(terminal: &mut Terminal<B>, app: &mut App) -> Result<()> {
    loop {
        terminal.draw(|f| {
            let chunks = Layout::default()
                .direction(Direction::Vertical)
                .constraints([
                    Constraint::Length(3),
                    Constraint::Min(5),
                    Constraint::Length(10),
                ])
                .split(f.area());

            let input = Paragraph::new(app.input.as_str())
                .block(Block::default().borders(Borders::ALL).title("Input"))
                .wrap(Wrap { trim: true });
            f.render_widget(input, chunks[0]);

            let main_chunks = Layout::default()
                .direction(Direction::Horizontal)
                .constraints([Constraint::Percentage(50), Constraint::Percentage(50)])
                .split(chunks[1]);

            let nodes_items: Vec<ListItem> = app
                .nodes_summary
                .iter()
                .map(|s| ListItem::new(s.as_str()))
                .collect();
            let nodes_list =
                List::new(nodes_items).block(Block::default().borders(Borders::ALL).title("Nodes"));
            f.render_widget(nodes_list, main_chunks[0]);

            let partials_items: Vec<ListItem> = app
                .partials_summary
                .iter()
                .map(|s| ListItem::new(s.as_str()))
                .collect();
            let partials_list = List::new(partials_items)
                .block(Block::default().borders(Borders::ALL).title("Partials"));
            f.render_widget(partials_list, main_chunks[1]);

            let extracted_items: Vec<ListItem> = app
                .extracted_summary
                .iter()
                .map(|s| ListItem::new(s.as_str()))
                .collect();
            let extracted_list = List::new(extracted_items).block(
                Block::default()
                    .borders(Borders::ALL)
                    .title("Extracted Triples & Status"),
            );
            f.render_widget(extracted_list, chunks[2]);
        })?;

        if event::poll(std::time::Duration::from_millis(100))? {
            if let Event::Key(key) = event::read()? {
                if key.kind == KeyEventKind::Press && app.handle_key(key) {
                    return Ok(());
                }
            }
        }
    }
}
