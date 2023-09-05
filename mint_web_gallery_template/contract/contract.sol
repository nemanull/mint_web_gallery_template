// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.4;

import "erc721a/contracts/ERC721A.sol";
import '@openzeppelin/contracts/access/Ownable.sol';
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract TEstok5NFT is ERC721A, Ownable, ERC2981 {
    uint256 public mintPrice;
    string public baseTokenUri;
    bool public isRevealed; // Add a state variable to track if NFTs are revealed
    bool public isPublicMintEnable;

    constructor() ERC721A('TEstok5', 'TET'){
        mintPrice = 0.005 ether;
        _setDefaultRoyalty(msg.sender, 500);
        // _mint(0x5876FbF6120F74128dfb50Ad9f48497c3740fc3B, 10); //кошелек Мира
    }

    function setIsPublicMintEnable(bool isPublicMintEnabled_) external onlyOwner {
        isPublicMintEnable = isPublicMintEnabled_;
    }

    function setBaseTokenUri(string calldata baseTokenUri_) external onlyOwner {
        baseTokenUri = baseTokenUri_;
        isRevealed = true;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (!isRevealed) {
            return string(abi.encodePacked("ipfs://", "bafybeiedfmlanue4o3hry7a6iov2p6gid7dqvods5x7m5q6ykblazgd7qu", "/0.json"));
        }
        require(_exists(tokenId), "Token doesn't exist" );
        return string(abi.encodePacked(baseTokenUri, Strings.toString(tokenId), ".json"));
    }

    function withdraw() external onlyOwner {
        (bool success, ) = msg.sender.call{value: address(this).balance}('');
        require(success, 'withdraw failed');
    }

    function mint(uint256 quantity_) public payable {
        require(isPublicMintEnable);
        require(msg.value >= quantity_ * mintPrice && quantity_ <= 20);
        _mint(msg.sender, quantity_);
        require(totalSupply() <= 1000);
        require(balanceOf(msg.sender) <= 20);
        
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721A, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}





