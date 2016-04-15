extern crate martini;
extern crate image;
extern crate clap;

use clap::{App, SubCommand};
use std::io::Write;
use std::thread::sleep;
use std::time::Duration;

fn main() {
    let arguments = App::new("Martini")
        .subcommand(SubCommand::with_name("shaken")
                                .about("shake it like a pro"))
        .subcommand(SubCommand::with_name("stirred")
                                .about("stir it like there is no tomorrow"))
        .get_matches();
    
    if let Some(_) = arguments.subcommand_name() {
        let img_as_bytes = include_bytes!("../martin.jpg");
        let included_img = image::load_from_memory_with_format(img_as_bytes, image::ImageFormat::JPEG).unwrap();
        
        match arguments.subcommand() {
            ("shaken", Some(_)) => {
                
                    let (true_colour, width, height) = (false, 40, 40);
                    for _ in 0..21{
                        std::io::stdout().write_all(b"\x1b[2J\x1b[1;1H").unwrap();   
                        martini::print_image(&included_img, true_colour, width, height, "    ");
                        sleep(Duration::from_millis(100));
                    
                        std::io::stdout().write_all(b"\x1b[2J\x1b[1;1H").unwrap();
                        martini::print_image(&included_img, true_colour, width, height, "");
                        sleep(Duration::from_millis(100))
                    }
            },
            ("stirred", Some(_)) => {
                println!("Maybe later...")
            },
            _ => unimplemented!()
        }
    }
    
}

// fn shake_it(img: image::GenericImage){
    
    
    
    // println!("SHAKEN")
// }